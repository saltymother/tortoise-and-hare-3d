#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "🚀 Pushing The Tortoise & The Hare 3D to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "📄 Pushing gh-pages branch..."
  git push -u origin gh-pages

  echo ""
  echo "✅ Push successful!"
  echo "🌐 Repository is live at: https://github.com/saltymother/tortoise-and-hare-3d"
  echo "📄 GitHub Pages will be live shortly at: https://saltymother.github.io/tortoise-and-hare-3d/"
  echo ""
  echo "💡 Note: GitHub Pages is configured via both:"
  echo "   1. GitHub Actions (auto-deploys via .github/workflows/deploy.yml)"
  echo "   2. gh-pages branch fallback"
else
  echo ""
  echo "❌ Push failed. If the repository hasn't been created on GitHub yet:"
  echo "👉 Click 'Create repository' on the tab that opened in Chrome, or visit:"
  echo "   https://github.com/new?name=tortoise-and-hare-3d"
  echo "Then run ./push_to_github.sh again!"
fi
