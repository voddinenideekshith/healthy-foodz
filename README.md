# Healthy Foodz — Static Website

This is a minimal, responsive static website for the Healthy Foodz cloud kitchen. It implements a clean, mobile-first UI, a simple cart, and WhatsApp / call ordering integration.

Files:
- index.html — main page
- css/styles.css — styles
- js/script.js — menu, cart and ordering logic

Contact:
- Phone: +91 89855 62963
- Email: deekshithvoddineni@gmail.com

Quick start:
1. Open `index.html` in a browser (no build required).
2. Images are included in the `images/` folder. The site references them automatically.
3. Email orders send to `deekshithvoddineni@gmail.com` via your mail client. WhatsApp/call use +91 89855 62963.

Deploy to GitHub Pages (automatic):

1. Create a new repository on GitHub and push this project to the `main` branch.
2. The included GitHub Actions workflow (`.github/workflows/gh-pages.yml`) will automatically publish the repository root to the `gh-pages` branch on every push to `main`.
3. After the workflow runs (check Actions tab), enable GitHub Pages in repository settings and set the source to the `gh-pages` branch.

Manual deploy option (simpler):

1. Use the `gh-pages` npm package or GitHub Pages settings to publish the `main` branch root directly.

Commands to push (from project root):

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Notes:
- The workflow uses the `GITHUB_TOKEN` and `peaceiris/actions-gh-pages` to publish the site.
- If you prefer Netlify or Vercel, you can also drag-and-drop or connect the repository directly.

Notes:
- Images reference Unsplash URLs (high-res). Replace with your own studio-quality assets in `images/` for best performance.
- To deploy, serve as static files (GitHub Pages, Netlify, Vercel, or any static host).
