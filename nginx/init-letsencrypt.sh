#!/usr/bin/env sh
set -eu

domains="souarteemcuidados.com.br www.souarteemcuidados.com.br"
email="admin@souarteemcuidados.com.br"
rsa_key_size=4096
data_path="./nginx/certbot/conf"
webroot_path="./nginx/certbot/www"
staging=0

if [ -d "$data_path/live/souarteemcuidados.com.br" ]; then
  echo "Certificado existente encontrado. Nada a fazer."
  exit 0
fi

mkdir -p "$data_path" "$webroot_path"

if [ ! -e "$data_path/options-ssl-nginx.conf" ] || [ ! -e "$data_path/ssl-dhparams.pem" ]; then
  echo "Baixando parametros SSL recomendados..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/options-ssl-nginx.conf > "$data_path/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/ssl-dhparams.pem"
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
