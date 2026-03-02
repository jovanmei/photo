# Photo Gallery

A minimalist photo gallery application built with React, TypeScript, and Tailwind CSS.

## 🚀 Deployment Guide

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Git
- GitHub account

### Step 1: Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `photo`
3. Make it public
4. Click "Create repository"

### Step 3: Connect Local Repository to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/jovanmei/photo.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 4: Configure GitHub Pages

1. Go to your repository on GitHub: https://github.com/jovanmei/photo
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select **gh-pages** and folder **/(root)**
6. Click **Save**

### Step 5: Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Click "I understand my workflows, go ahead and enable them"
3. The workflow will automatically run on the next push

### Step 6: Deploy

#### Option A: Automatic Deployment (Recommended)

Push any changes to the main branch, and GitHub Actions will automatically build and deploy:

```bash
git add .
git commit -m "Update content"
git push origin main
```

#### Option B: Manual Deployment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Step 7: Verify Deployment

1. Wait 2-3 minutes for the deployment to complete
2. Visit: https://jovanmei.github.io/photo
3. Your site should be live!

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── dist/                       # Build output (auto-generated)
├── node_modules/               # Dependencies (gitignored)
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── components/         # React components
│   │   ├── context/            # React context
│   │   ├── data/               # Data types and utilities
│   │   ├── utils/              # Utility functions
│   │   ├── views/              # Page views
│   │   ├── App.tsx             # Main app component
│   │   └── routes.tsx          # Route configuration
│   ├── styles/                 # CSS styles
│   └── main.tsx                # Entry point
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── README.md                   # This file
└── vite.config.ts              # Vite configuration
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Configuration Files

### .gitignore
Excludes:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env*` - Environment files
- IDE and OS specific files

### vite.config.ts
- Configured for GitHub Pages deployment
- Base path: `/photo/`
- React and Tailwind CSS plugins

### package.json
- Homepage: `https://jovanmei.github.io/photo`
- Deploy script: Uses `gh-pages` package
- Predeploy script: Builds before deploying

### .github/workflows/deploy.yml
- Automatically builds and deploys on push to main
- Uses GitHub Actions for CI/CD
- Deploys to `gh-pages` branch

## 🚨 Troubleshooting

### Issue: 404 errors on refresh
**Solution**: We're using HashRouter, so URLs will be like `/#/admin` instead of `/admin`

### Issue: Assets not loading
**Solution**: Check that `vite.config.ts` has `base: '/photo/'` configured

### Issue: Deployment not working
**Solution**: 
1. Check GitHub Actions logs in the Actions tab
2. Ensure GitHub Pages is enabled in Settings
3. Verify the repository is public

### Issue: Changes not reflecting
**Solution**: 
1. Clear browser cache
2. Wait 2-3 minutes for CDN to update
3. Check if build succeeded in Actions tab

## 🔧 Customization

### Change Repository Name

If you want to use a different repository name:

1. Update `vite.config.ts`:
   ```typescript
   base: '/your-repo-name/',
   ```

2. Update `package.json`:
   ```json
   "homepage": "https://jovanmei.github.io/your-repo-name"
   ```

3. Update GitHub remote:
   ```bash
   git remote set-url origin https://github.com/jovanmei/your-repo-name.git
   ```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Tailwind CSS Documentation](https://tailwindcss.com/)