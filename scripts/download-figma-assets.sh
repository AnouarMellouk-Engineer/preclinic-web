#!/usr/bin/env bash
# Downloads the static assets of the Figma "Register" frame (node 1:2009) into public/images/auth.
# The Figma asset URLs are temporary (7 days). If a download fails with 403/404, ask for a fresh set.
set -euo pipefail
BASE="https://www.figma.com/api/mcp/asset/d10e6e33-168b-4006-a673-c3a0878ff9cb"
OUT="public"
mkdir -p "$OUT"

dl() { curl -fL --retry 2 -o "$OUT/$2" "$BASE/$1" && echo "✓ $2"; }

dl 4fba7.svg logo.svg
dl 5fc43.png hero-doctors.png
dl e7cd7.svg hero-mask.svg
dl 34a63.svg hero-decoration.svg
dl a65ca.svg facebook.svg
dl c6520.svg google.svg
dl 5ccfe.svg apple.svg
