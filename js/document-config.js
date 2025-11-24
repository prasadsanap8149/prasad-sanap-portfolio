/**
 * SECURE DOCUMENT MANAGEMENT CONFIGURATION
 * Environment-specific PIN and security settings
 *
 * SECURITY WARNING: This configuration contains sensitive data
 * Do NOT commit actual PINs to public repositories
 * Use environment variables in production
 */

const DocumentConfig = {
  /**
   * ENVIRONMENT-SPECIFIC PIN
   * Change this value for different environments
   * Production: Use environment variable process.env.DOCUMENT_PIN
   * Development: Use a development PIN
   * Staging: Use a staging PIN
   */
  PIN: {
    // Default development PIN (CHANGE IN PRODUCTION)
    value: "1234",

    // Environment detection
    dev: "1234", // Development
    staging: "5678", // Staging
    prod: process.env.DOCUMENT_PIN || "3136", // Production (from env var)

    // Get current environment PIN
    getCurrent() {
      const env = this.detectEnvironment();
      return this[env] || this.value;
    },

    // Detect current environment
    detectEnvironment() {
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        return "dev";
      }
      if (window.location.hostname.includes("staging")) {
        return "staging";
      }
      return "prod";
    },
  },

  /**
   * DOCUMENT CATEGORIES AND STRUCTURE
   * Maps to the assets folder structure
   */
  CATEGORIES: {
    marksheets: {
      name: "Marksheets",
      icon: "fa-certificate",
      color: "#6366f1",
      description: "Academic Marksheets & Results",
      folder: "assets/marksheets/",
      files: [
        {
          name: "10TH MARKSHEET.pdf",
          title: "10th Grade Marksheet",
          category: "School",
        },
        {
          name: "12TH MARKSHEET.pdf",
          title: "12th Grade Marksheet",
          category: "School",
        },
      ],
    },
    skill_certificates: {
      name: "Skill Certificates",
      icon: "fa-award",
      color: "#ec4899",
      description: "Professional Skill Certifications",
      folder: "assets/skill_certificates/",
      files: [],
    },
    reward_and_recognitions: {
      name: "Rewards & Recognition",
      icon: "fa-trophy",
      color: "#f59e0b",
      description: "Awards and Recognition Documents",
      folder: "assets/reward_and_recognitions/",
      files: [],
    },
    others: {
      name: "Other Certificates",
      icon: "fa-file-pdf",
      color: "#10b981",
      description: "Additional Certificates and Documents",
      folder: "assets/others/",
      files: [
        {
          name: "COMPUTER TYPING.pdf",
          title: "Computer Typing Certificate",
          category: "Skills",
        },
        {
          name: "DATA ENTRY AND COMPUTER TYPING.pdf",
          title: "Data Entry & Computer Typing",
          category: "Skills",
        },
        { name: "MSCIT.pdf", title: "MSCIT Certificate", category: "IT" },
        {
          name: "NSS CERTIFICATE.pdf",
          title: "NSS Certificate",
          category: "Community Service",
        },
        {
          name: "TALLY CERTIFICATE.pdf",
          title: "Tally Certificate",
          category: "Accounting",
        },
        {
          name: "THINGS ON INTERNET CERTIFICATE.pdf",
          title: "Things on Internet Certificate",
          category: "Online",
        },
      ],
    },
  },

  /**
   * SECURITY SETTINGS
   */
  SECURITY: {
    // Maximum download attempts before cooldown
    MAX_ATTEMPTS: 5,

    // Cooldown period in milliseconds (5 minutes)
    COOLDOWN_PERIOD: 5 * 60 * 1000,

    // Session timeout for preview in milliseconds (30 minutes)
    SESSION_TIMEOUT: 30 * 60 * 1000,

    // Enable security logging
    ENABLE_LOGGING: true,

    // Maximum session time for document preview
    MAX_SESSION_TIME: 30 * 60 * 1000,

    // Allowed file extensions
    ALLOWED_EXTENSIONS: [".pdf"],

    // Maximum file size (MB)
    MAX_FILE_SIZE: 50,

    // Require PIN for downloads
    REQUIRE_PIN_FOR_DOWNLOAD: true,

    // Require PIN for preview (can be disabled for UX)
    REQUIRE_PIN_FOR_PREVIEW: false,

    // Enable right-click protection on previews
    DISABLE_CONTEXT_MENU: true,

    // Enable copy protection on previews
    DISABLE_COPY: true,

    // Track download attempts
    TRACK_ATTEMPTS: true,

    // Log to console (development only)
    DEBUG_LOGGING: false,
  },

  /**
   * PREVIEW SETTINGS
   */
  PREVIEW: {
    // Default viewer type
    VIEWER: "builtin", // 'builtin' or 'google-docs'

    // Height for PDF preview iframe
    HEIGHT: "700px",

    // Width for PDF preview iframe
    WIDTH: "100%",

    // Enable toolbar in preview
    TOOLBAR: true,

    // Auto-play for supported formats
    AUTO_PLAY: true,

    // Show file metadata
    SHOW_METADATA: true,
  },

  /**
   * DOWNLOAD SETTINGS
   */
  DOWNLOAD: {
    // Auto-delete temporary links after (milliseconds)
    LINK_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours

    // Rate limiting: downloads per hour
    RATE_LIMIT: 20,

    // Enable download acceleration (if server supports)
    ACCELERATION: false,

    // Add download timestamp to filename
    ADD_TIMESTAMP: false,

    // Track download location
    TRACK_LOCATION: true,
  },

  /**
   * UI/UX SETTINGS
   */
  UI: {
    // Show document file sizes
    SHOW_FILE_SIZE: true,

    // Show upload dates (if available)
    SHOW_DATES: false,

    // Animate on hover
    ANIMATE_HOVER: true,

    // Show preview on click
    QUICK_PREVIEW: true,

    // Number of columns in grid
    GRID_COLUMNS: {
      desktop: 4,
      tablet: 2,
      mobile: 1,
    },
  },

  /**
   * MESSAGES AND STRINGS
   */
  MESSAGES: {
    PIN_PROMPT: "Enter PIN to download this document",
    PIN_INCORRECT: "Incorrect PIN. Please try again.",
    PIN_ATTEMPTS_EXCEEDED: "Too many failed attempts. Please try again later.",
    DOWNLOAD_SUCCESS: "Document downloading...",
    DOWNLOAD_ERROR: "Error downloading document. Please try again.",
    PREVIEW_ERROR: "Error loading preview. Please try again.",
    FILE_NOT_FOUND: "Document not found.",
    UNAUTHORIZED: "You are not authorized to access this document.",
    SESSION_EXPIRED: "Your session has expired. Please try again.",
    SECURITY_WARNING: "This document requires PIN verification for download.",
  },

  /**
   * UTILITY METHODS
   */

  /**
   * Get all documents across all categories
   */
  getAllDocuments() {
    const docs = [];
    Object.values(this.CATEGORIES).forEach((category) => {
      category.files.forEach((file) => {
        docs.push({
          ...file,
          folder: category.folder,
          categoryName: category.name,
          categoryIcon: category.icon,
          categoryColor: category.color,
        });
      });
    });
    return docs;
  },

  /**
   * Get document by category
   */
  getDocumentsByCategory(categoryKey) {
    const category = this.CATEGORIES[categoryKey];
    if (!category) return [];
    return category.files.map((file) => ({
      ...file,
      folder: category.folder,
      categoryName: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color,
    }));
  },

  /**
   * Get full document path
   */
  getDocumentPath(categoryKey, fileName) {
    const category = this.CATEGORIES[categoryKey];
    if (!category) return null;
    return category.folder + fileName;
  },

  /**
   * Validate PIN
   */
  validatePIN(pin) {
    const currentPIN = this.PIN.getCurrent();
    return pin === currentPIN;
  },

  /**
   * Get environment info
   */
  getEnvironment() {
    return {
      env: this.PIN.detectEnvironment(),
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      timestamp: new Date().toISOString(),
    };
  },
};

// Export for module systems if used
if (typeof module !== "undefined" && module.exports) {
  module.exports = DocumentConfig;
}
