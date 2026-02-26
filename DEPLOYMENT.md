# RealBuddy — GitHub Hosting Setup

This guide explains how to host the website and enable the download link via GitHub.

**Security:** No usernames or repo info are hardcoded. The deployment workflow injects `github.repository` (e.g. `owner/RealBuddy`) at build time from GitHub's context — no secrets required.

## 1. Initialize Git and push to GitHub

```powershell
cd C:\Users\parsa\OneDrive\Documents\Docs\GH\RealBuddy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/RealBuddy.git
git push -u origin main
```

## 2. Enable GitHub Pages

1. Go to your repo on GitHub
2. **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**:
   - **Source**: GitHub Actions
4. Save

After the next push to `main`, the site will be live at:

**https://YOUR_USERNAME.github.io/RealBuddy/**

## 3. Create a release (for the Download button)

1. Build the app locally (optional test):
   ```powershell
   cd Widgit
   npm install
   npm run build
   ```

2. Create and push a version tag to trigger the release workflow:
   ```powershell
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. The workflow will build Windows (.exe), macOS (.dmg), and Linux (.AppImage) and create a release with all installers.

4. The Download button will then point to:
   **https://github.com/YOUR_USERNAME/RealBuddy/releases/latest**

## Summary

| What | URL |
|------|-----|
| Website | `https://<username>.github.io/RealBuddy/` |
| Download (latest) | `https://github.com/<username>/RealBuddy/releases/latest` |
| Repo | `https://github.com/<username>/RealBuddy` |

*(URLs are injected at deploy time from `github.repository` — no secrets in source.)*
