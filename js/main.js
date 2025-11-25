// ========================================
// NAVIGATION MENU TOGGLE
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLink = document.querySelectorAll(".nav-link");

  // Toggle menu on hamburger click
  navToggle.addEventListener("click", function () {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLink.forEach((link) => {
    link.addEventListener("click", function () {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideNav =
      navToggle.contains(event.target) || navLinks.contains(event.target);
    if (!isClickInsideNav && navLinks.classList.contains("active")) {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
});

// ========================================
// SCROLL ANIMATIONS - INTERSECTION OBSERVER
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add animation to timeline items, cards, and other elements
      if (entry.target.classList.contains("timeline-item")) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      } else if (
        entry.target.classList.contains("project-card") ||
        entry.target.classList.contains("skill-category") ||
        entry.target.classList.contains("dev-card")
      ) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements on page load
window.addEventListener("load", function () {
  document.querySelectorAll(".timeline-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-30px)";
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    observer.observe(el);
  });

  document
    .querySelectorAll(".project-card, .skill-category, .dev-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      observer.observe(el);
    });

  document.querySelectorAll(".info-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    observer.observe(el);
  });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Add background to navbar on scroll
  if (scrollTop > 100) {
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
    navbar.style.backdropFilter = "blur(20px)";
  } else {
    navbar.style.boxShadow = "none";
    navbar.style.backdropFilter = "blur(10px)";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ========================================
// SMOOTH SCROLL OFFSET FOR NAVIGATION
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// ========================================
// COUNTER ANIMATION FOR STATS
// ========================================

function animateCounters() {
  const stats = document.querySelectorAll(".stat h4");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const target = entry.target;
          const finalValue = parseInt(target.textContent);
          const increment = Math.ceil(finalValue / 50);
          let currentValue = 0;

          const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
              target.textContent = finalValue + "+";
              clearInterval(counter);
            } else {
              target.textContent = currentValue + "+";
            }
          }, 30);

          target.dataset.animated = "true";
          counterObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => {
    counterObserver.observe(stat);
  });
}

window.addEventListener("load", animateCounters);

// ========================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ========================================

window.addEventListener("scroll", function () {
  let current = "";
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// Add active class styling
const style = document.createElement("style");
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// ========================================
// RIPPLE EFFECT FOR BUTTONS
// ========================================

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    // Remove existing ripple if any
    const existingRipple = this.querySelector(".ripple");
    if (existingRipple) existingRipple.remove();

    this.appendChild(ripple);
  });
});

// Add ripple effect styles
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========================================
// LAZY LOAD IMAGES (if any)
// ========================================

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K to focus on search (can be extended)
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    // Can be extended for search functionality
  }

  // Escape to close mobile menu
  if (e.key === "Escape") {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (navLinks.classList.contains("active")) {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  }
});

// ========================================
// COPY EMAIL TO CLIPBOARD
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  emailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const email = this.getAttribute("href").substring(7);

      // Copy to clipboard
      navigator.clipboard
        .writeText(email)
        .then(() => {
          // Visual feedback
          const originalText = this.textContent;
          this.textContent = "Copied!";
          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy email:", err);
        });
    });
  });
});

// ========================================
// PRELOAD RESOURCES
// ========================================

window.addEventListener("load", function () {
  // Ensure smooth transitions after page load
  document.body.style.opacity = "1";
});

// ========================================
// FORM VALIDATION (If added in future)
// ========================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(phone);
}

// ========================================
// THEME TOGGLE (Optional - for future dark/light mode)
// ========================================

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

window.addEventListener("load", initTheme);

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================

// Ensure proper focus management
document.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", function () {
  document.body.classList.remove("keyboard-nav");
});

// Add keyboard navigation styles
const accessibilityStyle = document.createElement("style");
accessibilityStyle.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px;
    }
`;
document.head.appendChild(accessibilityStyle);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Use debounce for scroll-heavy operations if needed
const debouncedScroll = debounce(function () {
  // Perform expensive operations
}, 100);

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
  "%c👋 Welcome to Prasad Sanap's Portfolio!",
  "font-size: 16px; font-weight: bold; color: #6366f1;"
);
console.log(
  "%cLike what you see? Let's build something amazing together!",
  "font-size: 14px; color: #ec4899;"
);
console.log(
  "%cReach out: prasadsanap8149@gmail.com",
  "font-size: 12px; color: #94a3b8;"
);

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  // Smooth scroll to top
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========================================
// READING PROGRESS BAR
// ========================================

function createProgressBar() {
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress";
  progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
  document.body.prepend(progressBar);

  window.addEventListener("scroll", function () {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

    const fillElement = document.querySelector(".reading-progress-fill");
    if (fillElement) {
      fillElement.style.width = scrollPercent + "%";
    }
  });
}

createProgressBar();
