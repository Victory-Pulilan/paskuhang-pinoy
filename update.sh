#!/usr/bin/env bash
#
# Paskuhang Pinoy — i-publish ang mga pagbabago
#
#   cd ~/paskuhanpinoy/landing-page
#   bash update.sh "ano ang binago"
#
# Live sa https://victory-pulilan.github.io/paskuhang-pinoy/ mga 1–2 minuto pagkatapos.
#
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

MSG="${1:-update}"

# Bagong version para hindi lumang kopya ang makita sa phone.
V=$(date +%Y%m%d%H%M)
sed -i.bak -E "s#(assets/(css/style\.css|js/main\.js))(\?v=[0-9]+)?\"#\1?v=${V}\"#g" index.html
rm -f index.html.bak

git add -A
if git diff --cached --quiet; then
  echo "Walang bagong babaguhin."
  exit 0
fi
git commit -qm "$MSG"
git push -q
echo "✓ Naipadala. Live na mga 1–2 minuto: https://victory-pulilan.github.io/paskuhang-pinoy/"
