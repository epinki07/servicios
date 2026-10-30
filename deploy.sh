#!/bin/bash
# Publica la carpeta out/ en la rama gh-pages (GitHub Pages: epinki07.github.io/servicios).
# Uso: npm run deploy
set -e
cd "$(dirname "$0")/out"
touch .nojekyll
rm -rf .git && git init -q -b gh-pages && git add -A
git commit -q -m "Publicar sitio $(date +%Y-%m-%d)"
git push -q -f https://github.com/epinki07/servicios.git gh-pages
rm -rf .git
echo "Publicado: https://epinki07.github.io/servicios/"
