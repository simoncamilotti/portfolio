#!/bin/sh
# Generates /config.js from the environment when the container starts.
# WEB_RECAPTCHA_SITE_KEY and WEB_UMAMI_* are optional: empty, the contact form sends no
# reCAPTCHA token and no analytics script is loaded.
set -eu

if [ -z "${WEB_API_URL:-}" ]; then
  echo "WEB_API_URL is required" >&2
  exit 1
fi

export WEB_RECAPTCHA_SITE_KEY="${WEB_RECAPTCHA_SITE_KEY:-}"
export WEB_UMAMI_SRC="${WEB_UMAMI_SRC:-}"
export WEB_UMAMI_WEBSITE_ID="${WEB_UMAMI_WEBSITE_ID:-}"

envsubst '${WEB_API_URL} ${WEB_RECAPTCHA_SITE_KEY} ${WEB_UMAMI_SRC} ${WEB_UMAMI_WEBSITE_ID}' \
  < /etc/app/config.js.template > /usr/share/nginx/html/config.js
