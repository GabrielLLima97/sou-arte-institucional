#!/usr/bin/env sh
set -eu

domains="souarteemcuidados.com.br www.souarteemcuidados.com.br clinicasouluz.com.br www.clinicasouluz.com.br souluzassessoria.com.br www.souluzassessoria.com.br"
primary_domain="souarteemcuidados.com.br"
email="admin@souarteemcuidados.com.br"
rsa_key_size=4096
data_path="./nginx/certbot/conf"
webroot_path="./nginx/certbot/www"
staging=0

ensure_writable() {
  target="$1"
  if [ -w "$target" ]; then
    return
  fi
  if command -v sudo >/dev/null 2>&1; then
    sudo chown -R "$(id -u)":"$(id -g)" "$target"
    return
  fi
  echo "Sem permissao para escrever em $target. Execute com sudo."
  exit 1
}

remove_path() {
  target="$1"
  if [ ! -e "$target" ]; then
    return
  fi
  if rm -rf "$target" 2>/dev/null; then
    return
  fi
  if command -v sudo >/dev/null 2>&1; then
    sudo rm -rf "$target"
    return
  fi
  echo "Sem permissao para remover $target. Execute com sudo."
  exit 1
}

cert_dir="$data_path/live/$primary_domain"
archive_dir="$data_path/archive/$primary_domain"
renewal_conf="$data_path/renewal/$primary_domain.conf"
cleanup_dummy=0
needs_expand=0

if [ -f "$cert_dir/fullchain.pem" ]; then
  cert_info="$(openssl x509 -in "$cert_dir/fullchain.pem" -noout -text 2>/dev/null || true)"
  if echo "$cert_info" | grep -qi "Let's Encrypt"; then
    missing_domains=""
    for domain in $domains; do
      if ! echo "$cert_info" | grep -q "DNS:$domain"; then
        missing_domains="$missing_domains $domain"
      fi
    done
    if [ -z "$missing_domains" ]; then
      echo "Certificado Let's Encrypt existente encontrado. Nada a fazer."
      exit 0
    fi
    needs_expand=1
    echo "Certificado Let's Encrypt existente, mas faltam dominios:$missing_domains"
  else
    cleanup_dummy=1
    echo "Certificado existente e provisório. Tentando emitir o certificado valido."
  fi
fi

mkdir -p "$data_path" "$webroot_path"
ensure_writable "$data_path"
ensure_writable "$webroot_path"

if [ ! -e "$data_path/options-ssl-nginx.conf" ] || [ ! -e "$data_path/ssl-dhparams.pem" ]; then
  echo "Baixando parametros SSL recomendados..."
  options_url="https://raw.githubusercontent.com/certbot/certbot/main/certbot/certbot/options-ssl-nginx.conf"
  dhparams_url="https://raw.githubusercontent.com/certbot/certbot/main/certbot/certbot/ssl-dhparams.pem"

  if ! curl -fsSL "$options_url" > "$data_path/options-ssl-nginx.conf"; then
    echo "Falha ao baixar options-ssl-nginx.conf. Usando configuracao minima."
    cat > "$data_path/options-ssl-nginx.conf" <<'EOF'
ssl_session_cache shared:le_nginx_SSL:10m;
ssl_session_timeout 1440m;
ssl_session_tickets off;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
EOF
  fi

  if ! curl -fsSL "$dhparams_url" > "$data_path/ssl-dhparams.pem"; then
    echo "Falha ao baixar ssl-dhparams.pem. Gerando localmente..."
    openssl dhparam -out "$data_path/ssl-dhparams.pem" 2048
  fi
fi

echo "Criando certificado dummy..."
path="$data_path/live/$primary_domain"
mkdir -p "$path"
if [ ! -f "$path/fullchain.pem" ] || [ ! -f "$path/privkey.pem" ]; then
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$path/privkey.pem" \
    -out "$path/fullchain.pem" \
    -subj "/CN=localhost"
  cleanup_dummy=1
fi

echo "Subindo Nginx..."
docker compose up -d nginx

if [ "$cleanup_dummy" -eq 1 ]; then
  echo "Removendo certificado dummy..."
  remove_path "$cert_dir"
  remove_path "$archive_dir"
  remove_path "$renewal_conf"
fi

domain_args=""
for domain in $domains; do
  domain_args="$domain_args -d $domain"
done

email_arg="--email $email"
if [ -z "$email" ]; then
  email_arg="--register-unsafely-without-email"
fi

staging_arg=""
if [ "$staging" != "0" ]; then
  staging_arg="--staging"
fi

echo "Solicitando certificado Let's Encrypt..."
expand_arg=""
if [ "$needs_expand" -eq 1 ]; then
  expand_arg="--expand --cert-name $primary_domain"
fi
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  $staging_arg \
  $email_arg \
  $domain_args \
  $expand_arg \
  --rsa-key-size $rsa_key_size \
  --agree-tos \
  --force-renewal

echo "Recarregando Nginx..."
docker compose exec nginx nginx -s reload

echo "Concluido."
