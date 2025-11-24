# 📋 Quick Reference Guide

## File Organization

```
prasad-sanap-portfolio/
├── index.html                    # Main portfolio page
├── css/
│   └── style.css               # All styling and responsive design
├── js/
│   └── main.js                 # JavaScript for interactivity
├── images/                     # Image assets (add your profile pic here)
├── assets/                     # Additional assets
├── README.md                   # Project documentation
├── DEPLOYMENT_GUIDE.md         # GitHub Pages setup guide
├── QUICK_REFERENCE.md          # This file
├── _config.yml                 # Jekyll configuration
└── .gitignore                  # Git ignore rules
```

## 🎨 Customization Quick Tips

### Change Primary Color

Open `css/style.css` and update:

```css
:root {
  --primary-color: #6366f1; /* Change this color */
  --secondary-color: #ec4899;
}
```

### Update Personal Information

Open `index.html` and search for:

- Your name
- Email address
- Phone number
- LinkedIn profile URL
- GitHub profile URL

### Add Project

In `index.html`, find the `<!-- Projects Section -->` and duplicate a project card:

```html
<div class="project-card">
  <div class="project-header">
    <h3>Your Project Name</h3>
    <span class="project-status">Current</span>
  </div>
  <p class="project-description">Your project description here</p>
  <!-- Add more content -->
</div>
```

### Add Skill

In `skills` section, add a new skill tag:

```html
<span class="skill-tag">Your Skill</span>
```

## 🚀 Deployment Steps (Quick)

```bash
# 1. Navigate to project
cd /path/to/prasad-sanap-portfolio

# 2. Initialize Git (first time only)
git init

# 3. Add all files
git add .

# 4. Create commit
git commit -m "Portfolio update"

# 5. Add remote (first time only)
git remote add origin https://github.com/YOUR_USERNAME/prasad-sanap-portfolio.git

# 6. Push to GitHub
git push -u origin main

# 7. Enable GitHub Pages in repository settings
```

Your site will be live at: `https://YOUR_USERNAME.github.io/prasad-sanap-portfolio/`

## 🔧 Key JavaScript Functions

### Mobile Menu Toggle

```javascript
// Handles hamburger menu on mobile
```

### Smooth Scroll

```javascript
// Automatic on all #anchor links
```

### Animation on Scroll

```javascript
// Elements animate in when they come into view
```

### Email Copy

```javascript
// Click email to copy to clipboard
```

## 📱 Responsive Breakpoints

```css
Desktop:   Full layout
Tablet:    768px and below
Mobile:    480px and below
```

All sections automatically adapt to screen size.

## 🎯 SEO Meta Tags

Update these in `index.html` `<head>`:

```html
<meta name="description" content="Your description" />
<meta name="keywords" content="Keywords, separated, by, commas" />
<meta name="author" content="Your Name" />
```

## 🔗 External Links

These are already included:

- Google Fonts (Poppins, JetBrains Mono)
- Font Awesome Icons
- No jQuery or heavy dependencies

## 📊 Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## ⚡ Performance

- Load time: < 2 seconds
- No backend required
- All static files
- Optimized CSS and JS

## 🛡️ Security

- No data collection
- No backend needed
- No database required
- Safe to share publicly

## 📸 Add Profile Photo

1. Save image as: `images/profile.jpg` (or .png)
2. Add to HTML:

```html
<img src="images/profile.jpg" alt="Prasad Sanap" class="profile-image" />
```

3. Add CSS styling in `style.css`:

```css
.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
}
```

## 💬 Contact Links

All contact methods use standard links:

- Email: `<a href="mailto:email@example.com">`
- Phone: `<a href="tel:+911234567890">`
- LinkedIn: Direct external link

## 🎨 CSS Classes Cheat Sheet

```css
.btn-primary          /* Primary button */
/* Primary button */
.btn-secondary        /* Secondary button */
.gradient-text        /* Gradient colored text */
.section-title        /* Section heading */
.skill-tag            /* Skill badge */
.project-card         /* Project showcase card */
.timeline-item        /* Experience timeline */
.social-link; /* Social media button */
```

## 📝 Content Sections

1. **Hero** - Introduction
2. **About** - Summary & stats
3. **Skills** - Technical skills
4. **Experience** - Work history
5. **Projects** - Project showcase
6. **Development** - Training & certifications
7. **Contact** - Get in touch

## 🔄 Update Workflow

```
1. Edit files locally
   ↓
2. Test in browser (open index.html)
   ↓
3. Stage changes (git add .)
   ↓
4. Commit changes (git commit -m "message")
   ↓
5. Push to GitHub (git push)
   ↓
6. Site auto-updates (1-2 minutes)
```

## 📞 Support Resources

- **GitHub Pages**: docs.github.com/en/pages
- **Git Help**: git-scm.com/doc
- **Font Awesome**: fontawesome.com
- **Google Fonts**: fonts.google.com

## ✨ Pro Tips

1. **Add testimonials** - Create a new section
2. **Add blog** - Create a `/blog` folder
3. **Add contact form** - Use Formspree or similar
4. **Add dark mode toggle** - Already partially set up
5. **Track visitors** - Add Google Analytics
6. **Custom domain** - Update DNS records
7. **Speed optimization** - Compress images
8. **SEO optimization** - Add schema markup

## 🎯 Next Improvements (Optional)

- [ ] Add profile picture
- [ ] Add blog section
- [ ] Add CV download button
- [ ] Add Google Analytics
- [ ] Setup custom domain
- [ ] Add contact form
- [ ] Add more projects
- [ ] Add testimonials
- [ ] Add case studies

---

**Happy portfolio building! 🚀**

For detailed deployment guide, see `DEPLOYMENT_GUIDE.md`
