#!/usr/bin/env sh
set -eu

domains="souarteemcuidados.com.br www.souarteemcuidados.com.br"
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

if [ -d "$data_path/live/souarteemcuidados.com.br" ]; then
  echo "Certificado existente encontrado. Nada a fazer."
  exit 0
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
path="$data_path/live/souarteemcuidados.com.br"
mkdir -p "$path"
openssl req -x509 -nodes -newkey rsa:1024 -days 1 \
  -keyout "$path/privkey.pem" \
  -out "$path/fullchain.pem" \
  -subj "/CN=localhost"

echo "Subindo Nginx..."
docker compose up -d nginx

echo "Removendo certificado dummy..."
rm -rf "$path"

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
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  $staging_arg \
  $email_arg \
  $domain_args \
  --rsa-key-size $rsa_key_size \
  --agree-tos \
  --force-renewal

echo "Recarregando Nginx..."
docker compose exec nginx nginx -s reload

echo "Concluido."
