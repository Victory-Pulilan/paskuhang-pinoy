#!/usr/bin/env bash
#
# Paskuhang Pinoy — publish to GitHub Pages
#
#   cd ~/paskuhanpinoy/landing-page
#   bash deploy-to-github.sh
#
# Ligtas patakbuhin nang paulit-ulit. Walang binubura.
#
set -euo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bold=$'\033[1m'; green=$'\033[32m'; yellow=$'\033[33m'; red=$'\033[31m'; off=$'\033[0m'
say()  { printf '%s\n' "$*"; }
ok()   { printf '%s✓%s %s\n' "$green" "$off" "$*"; }
warn() { printf '%s!%s %s\n' "$yellow" "$off" "$*"; }
die()  { printf '%s✗%s %s\n' "$red" "$off" "$*" >&2; exit 1; }

say "${bold}Paskuhang Pinoy → GitHub Pages${off}"
say ""

# ---------------------------------------------------------------- checks ----
command -v git >/dev/null 2>&1 || die "Walang git. I-install: xcode-select --install"
[ -f index.html ] || die "Patakbuhin ito sa loob ng landing-page folder."
ok "git $(git --version | awk '{print $3}')"

# ---------------------------------------------------------------- inputs ----
DEFAULT_REPO="paskuhang-pinoy"
read -r -p "Pangalan ng repo [$DEFAULT_REPO]: " REPO
REPO="${REPO:-$DEFAULT_REPO}"

read -r -p "GitHub username mo: " USERNAME
[ -n "$USERNAME" ] || die "Kailangan ang username."

say ""
warn "Ang GitHub Pages ay libre lang sa PUBLIC na repo."
warn "Ibig sabihin: makikita ng kahit sino ang page at ang mga litrato."
read -r -p "Ok lang ba? [y/N]: " CONFIRM
case "$CONFIRM" in [yY]*) ;; *) die "Kanselado. Subukan ang Cloudflare Pages kung gusto mong private." ;; esac

# ---------------------------------------------------------------- files -----
[ -f .gitignore ] || cat > .gitignore <<'EOF'
.DS_Store
*.zip
EOF

# Hindi Jekyll ang site na ito — iwasang i-proseso ng GitHub.
touch .nojekyll

# Absolute URL para gumana ang link preview sa Messenger / Facebook.
PAGE_URL="https://${USERNAME}.github.io/${REPO}/"
if grep -q 'content="assets/img/og-cover.jpg"' index.html; then
  # macOS at Linux na sed
  sed -i.bak "s|content=\"assets/img/og-cover.jpg\"|content=\"${PAGE_URL}assets/img/og-cover.jpg\"|" index.html
  sed -i.bak "s|<link rel=\"canonical\" href=\"./\">|<link rel=\"canonical\" href=\"${PAGE_URL}\">|" index.html
  rm -f index.html.bak
  ok "Na-set ang og:image sa ${PAGE_URL}assets/img/og-cover.jpg"
fi

# ---------------------------------------------------------------- git -------
if [ ! -d .git ]; then
  git init -q
  git symbolic-ref HEAD refs/heads/main
  ok "Na-init ang git repo"
fi

git add -A
if git diff --cached --quiet 2>/dev/null; then
  say "Walang bagong babaguhin."
else
  git commit -qm "Paskuhang Pinoy landing page" || true
  ok "Na-commit ang mga file"
fi

# ---------------------------------------------------------------- push ------
PUSHED=0
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  ok "Naka-login ang gh CLI — automatic na ang lahat"
  if gh repo view "${USERNAME}/${REPO}" >/dev/null 2>&1; then
    git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/${USERNAME}/${REPO}.git"
    git push -u origin main
  else
    gh repo create "${USERNAME}/${REPO}" --public --source=. --remote=origin --push
  fi
  PUSHED=1

  say ""
  say "Binubuksan ang GitHub Pages…"
  gh api -X POST "repos/${USERNAME}/${REPO}/pages" \
     -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/${USERNAME}/${REPO}/pages" \
     -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || warn "Buksan nang manu-mano: Settings → Pages → main / root"
  ok "Naka-on na ang GitHub Pages"
else
  warn "Walang naka-login na gh CLI — manu-mano ang huling hakbang."
  git remote get-url origin >/dev/null 2>&1 \
    || git remote add origin "https://github.com/${USERNAME}/${REPO}.git"
  say ""
  say "${bold}Gawin ito:${off}"
  say "  1. Pumunta sa https://github.com/new"
  say "     Repository name: ${bold}${REPO}${off}   •   Public   •   HUWAG lagyan ng README"
  say "  2. Balik dito at i-paste:"
  say ""
  say "       git push -u origin main"
  say ""
  say "  3. Sa repo: Settings → Pages → Source: ${bold}Deploy from a branch${off}"
  say "     Branch: ${bold}main${off} / ${bold}/ (root)${off} → Save"
fi

# ---------------------------------------------------------------- done ------
say ""
say "${bold}Ang link ng imbitasyon:${off}"
say "  ${green}${PAGE_URL}${off}"
say ""
if [ "$PUSHED" = "1" ]; then
  say "Mga 1–2 minuto bago ito mag-live sa unang beses."
else
  say "Mag-live ito 1–2 minuto matapos ang mga hakbang sa taas."
fi
say ""
say "Para sa susunod na update:  git add -A && git commit -m 'update' && git push"
