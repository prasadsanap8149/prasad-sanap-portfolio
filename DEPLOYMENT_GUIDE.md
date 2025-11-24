# 🚀 GitHub Pages Deployment Guide

Complete step-by-step guide to deploy your portfolio to GitHub Pages.

## Prerequisites

- GitHub account (create at https://github.com)
- Git installed on your computer
- Your repository already created on GitHub

## Step 1: Prepare Your Local Repository

### 1.1 Initialize Git (if not already done)

```bash
cd /path/to/prasad-sanap-portfolio
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 1.2 Add all files to Git

```bash
git add .
```

### 1.3 Create initial commit

```bash
git commit -m "Initial portfolio commit with all files"
```

## Step 2: Connect to GitHub Repository

### 2.1 Add remote origin

```bash
git remote add origin https://github.com/prasadsanap8149/prasad-sanap-portfolio.git
```

### 2.2 Verify remote

```bash
git remote -v
```

You should see:

```
origin  https://github.com/prasadsanap8149/prasad-sanap-portfolio.git (fetch)
origin  https://github.com/prasadsanap8149/prasad-sanap-portfolio.git (push)
```

## Step 3: Push to GitHub

### 3.1 Rename branch to main (if needed)

```bash
git branch -M main
```

### 3.2 Push to GitHub

```bash
git push -u origin main
```

You'll be prompted to enter your GitHub credentials.

## Step 4: Enable GitHub Pages

### 4.1 Go to Repository Settings

1. Go to https://github.com/prasadsanap8149/prasad-sanap-portfolio
2. Click on **Settings** (top-right menu)
3. Scroll down to **GitHub Pages** section

### 4.2 Configure GitHub Pages

1. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
2. Click **Save**

### 4.3 Wait for deployment

GitHub will start building and deploying your site. This usually takes 1-2 minutes.

## Step 5: Access Your Portfolio

Once deployed, your portfolio will be available at:

```
https://prasadsanap8149.github.io/prasad-sanap-portfolio/
```

Check the GitHub Pages section in Settings for the exact URL.

## 🔄 Making Updates

After initial deployment, any changes you make locally can be pushed to update your live site:

```bash
# Make your changes to files

# Stage changes
git add .

# Commit changes
git commit -m "Update portfolio with new project"

# Push to GitHub
git push
```

Your site will automatically rebuild within 1-2 minutes.

## 💡 Optional: Use Custom Domain

If you own a custom domain (e.g., prasad-sanap.com):

### 1. Add CNAME record

In your domain registrar's DNS settings, add:

```
CNAME record: www → prasadsanap8149.github.io
```

### 2. Configure in GitHub

1. Go to Repository Settings
2. Scroll to **GitHub Pages**
3. Under "Custom domain", enter your domain name
4. Click **Save**
5. Check "Enforce HTTPS"

Your site will then be available at: `https://prasad-sanap.com`

## 🔐 Security Best Practices

### 1. Use HTTPS

- GitHub Pages automatically provides HTTPS
- Always enable "Enforce HTTPS" in settings

### 2. Protect Sensitive Information

- Never commit API keys, passwords, or tokens
- Use `.gitignore` for sensitive files

### 3. Review .gitignore

Ensure these are ignored:

```
node_modules/
.env
.env.local
*.log
.DS_Store
```

## ⚡ Performance Tips

### 1. Optimize Images

- Compress images before committing
- Use modern formats (WebP)
- Keep images in `/images` folder

### 2. Minimize CSS/JS

- Current files are already optimized
- Avoid inline styles

### 3. Monitor Build Times

- Check GitHub Actions in repository
- Fix any build errors immediately

## 🐛 Troubleshooting

### Issue: Site not showing up after push

**Solution:**

1. Wait 1-2 minutes for GitHub to rebuild
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check GitHub Pages settings are configured
4. Check Actions tab for build errors

### Issue: CSS/JS not loading

**Solution:**

1. Check baseurl in `_config.yml`
2. Verify file paths are correct
3. Clear browser cache
4. Check browser console for 404 errors

### Issue: Build fails

**Solution:**

1. Check GitHub Actions tab for error messages
2. Verify all file paths are correct
3. Ensure no special characters in filenames
4. Check for syntax errors in code

## 📊 Monitor Your Site

### Check Build Status

1. Go to your repository
2. Click on **Actions** tab
3. View latest workflow runs
4. Check "Deploy with GitHub Pages engine" status

### View Analytics (Optional)

Add Google Analytics:

1. Create Google Analytics account
2. Get Tracking ID
3. Add to `_config.yml`:
   ```yaml
   google_analytics: GA-XXXXXXXXX-X
   ```

## 🎯 Next Steps

### After Deployment

1. **Test Your Site**

   - Visit your live URL
   - Test all navigation links
   - Check mobile responsiveness
   - Verify all images load

2. **Share Your Portfolio**

   - Update LinkedIn profile link
   - Share on social media
   - Include in resumes
   - Send to recruiters

3. **Keep it Updated**
   - Add new projects regularly
   - Update skills and experience
   - Keep content fresh and relevant

## 📝 Common Git Commands

```bash
# Check status
git status

# View recent commits
git log --oneline -5

# Undo last commit (not pushed)
git reset --soft HEAD~1

# View differences
git diff

# Revert to previous commit
git revert <commit-hash>

# Create a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branches
git merge feature/new-feature

# Delete local branch
git branch -d feature/new-feature
```

## 🆘 Need Help?

- GitHub Pages Docs: https://docs.github.com/en/pages
- Git Docs: https://git-scm.com/doc
- Troubleshooting: https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting

---

**Your portfolio is now live! 🎉**

Good luck with your career, Prasad!
