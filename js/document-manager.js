/**
 * SECURE DOCUMENT MANAGER
 * Handles preview, download, and security for portfolio documents
 *
 * Features:
 * - PIN-protected downloads
 * - Secure preview functionality
 * - Attempt tracking and rate limiting
 * - Security logging
 * - Session management
 */

class SecureDocumentManager {
  constructor() {
    this.config = DocumentConfig;
    this.sessions = new Map();
    this.attempts = new Map();
    this.logs = [];
    this.currentSession = null;

    this.init();
  }

  /**
   * Initialize the document manager
   */
  init() {
    this.log("DocumentManager initialized", "info");
    this.setupEventListeners();
    this.cleanupExpiredSessions();

    // Periodic cleanup
    setInterval(() => this.cleanupExpiredSessions(), 60000); // Every minute
  }

  /**
   * Setup event listeners for document actions
   */
  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("doc-preview-btn")) {
        e.preventDefault();
        const docPath = e.target.dataset.docPath;
        const docName = e.target.dataset.docName;
        this.handlePreview(docPath, docName);
      }

      if (e.target.classList.contains("doc-download-btn")) {
        e.preventDefault();
        const docPath = e.target.dataset.docPath;
        const docName = e.target.dataset.docName;
        this.handleDownload(docPath, docName);
      }

      if (e.target.classList.contains("pin-submit")) {
        e.preventDefault();
        this.submitPIN();
      }

      if (e.target.classList.contains("close-modal")) {
        e.preventDefault();
        this.closeModal();
      }
    });
  }

  /**
   * PREVIEW FUNCTIONALITY
   */

  /**
   * Handle document preview request
   */
  async handlePreview(docPath, docName) {
    try {
      this.log(`Preview requested for: ${docName}`, "info");

      // Check if PIN required for preview
      if (this.config.SECURITY.REQUIRE_PIN_FOR_PREVIEW) {
        this.showPINPrompt("preview", docPath, docName);
      } else {
        this.showPreview(docPath, docName);
      }
    } catch (error) {
      this.log(`Preview error: ${error.message}`, "error");
      this.showError(this.config.MESSAGES.PREVIEW_ERROR);
    }
  }

  /**
   * Show document preview
   */
  showPreview(docPath, docName) {
    // Check if file exists
    if (!this.validateDocumentPath(docPath)) {
      this.showError(this.config.MESSAGES.FILE_NOT_FOUND);
      return;
    }

    // Create modal
    const modal = this.createPreviewModal(docPath, docName);
    document.body.appendChild(modal);

    // Apply security measures
    this.applyPreviewSecurity(modal);

    // Log preview session
    this.createSession(docPath, "preview");

    // Show modal
    modal.style.display = "flex";

    this.log(`Preview opened for: ${docName}`, "info");
  }

  /**
   * Create preview modal
   */
  createPreviewModal(docPath, docName) {
    const modal = document.createElement("div");
    modal.className = "document-preview-modal";
    modal.innerHTML = `
            <div class="document-preview-container">
                <div class="preview-header">
                    <h3>${this.escapeHTML(docName)}</h3>
                    <button class="close-modal" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="preview-content">
                    <iframe 
                        src="${
                          this.config.PREVIEW.VIEWER === "google-docs"
                            ? `https://docs.google.com/gview?url=${encodeURIComponent(
                                window.location.origin + "/" + docPath
                              )}&embedded=true`
                            : docPath
                        }" 
                        title="Document Preview"
                        height="${this.config.PREVIEW.HEIGHT}"
                        width="${this.config.PREVIEW.WIDTH}"
                        class="document-viewer"
                        oncontextmenu="return false;"
                    ></iframe>
                </div>
                <div class="preview-footer">
                    <p class="preview-notice">
                        <i class="fas fa-info-circle"></i>
                        ${this.config.MESSAGES.SECURITY_WARNING}
                    </p>
                </div>
            </div>
        `;
    return modal;
  }

  /**
   * Apply security measures to preview
   */
  applyPreviewSecurity(modal) {
    // Disable right-click in preview
    if (this.config.SECURITY.DISABLE_CONTEXT_MENU) {
      modal.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.log("Right-click blocked on preview", "security");
        return false;
      });
    }

    // Disable copy in preview
    if (this.config.SECURITY.DISABLE_COPY) {
      modal.addEventListener("copy", (e) => {
        e.preventDefault();
        this.log("Copy blocked on preview", "security");
        return false;
      });
    }

    // Add keyboard shortcuts protection
    modal.addEventListener("keydown", (e) => {
      // Block Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        this.log("Save blocked on preview", "security");
      }
      // Block Ctrl+C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (this.config.SECURITY.DISABLE_COPY) {
          e.preventDefault();
          this.log("Keyboard copy blocked on preview", "security");
        }
      }
    });
  }

  /**
   * DOWNLOAD FUNCTIONALITY
   */

  /**
   * Handle download request
   */
  async handleDownload(docPath, docName) {
    try {
      this.log(`Download requested for: ${docName}`, "info");

      // Check rate limiting
      if (!this.checkRateLimit(docName)) {
        this.showError(this.config.MESSAGES.PIN_ATTEMPTS_EXCEEDED);
        return;
      }

      // Show PIN prompt for download
      if (this.config.SECURITY.REQUIRE_PIN_FOR_DOWNLOAD) {
        this.showPINPrompt("download", docPath, docName);
      } else {
        this.performDownload(docPath, docName);
      }
    } catch (error) {
      this.log(`Download error: ${error.message}`, "error");
      this.showError(this.config.MESSAGES.DOWNLOAD_ERROR);
    }
  }

  /**
   * Perform actual download
   */
  performDownload(docPath, docName) {
    try {
      // Validate path
      if (!this.validateDocumentPath(docPath)) {
        this.showError(this.config.MESSAGES.FILE_NOT_FOUND);
        this.log(`Invalid document path: ${docPath}`, "security");
        return;
      }

      // Create download link
      const link = document.createElement("a");
      link.href = docPath;
      link.download = this.config.DOWNLOAD.ADD_TIMESTAMP
        ? `${docName.replace(".pdf", "")}_${Date.now()}.pdf`
        : docName;

      // Add security headers via fetch if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log download
      this.log(`Document downloaded: ${docName}`, "download", {
        path: docPath,
        timestamp: new Date().toISOString(),
        location: this.getLocationInfo(),
      });

      this.showSuccess(this.config.MESSAGES.DOWNLOAD_SUCCESS);
    } catch (error) {
      this.log(`Download execution error: ${error.message}`, "error");
      this.showError(this.config.MESSAGES.DOWNLOAD_ERROR);
    }
  }

  /**
   * PIN AND AUTHENTICATION
   */

  /**
   * Show PIN prompt modal
   */
  showPINPrompt(action, docPath, docName) {
    // Check if already showing PIN prompt
    if (document.querySelector(".pin-prompt-modal")) {
      return;
    }

    const modal = document.createElement("div");
    modal.className = "pin-prompt-modal";
    modal.innerHTML = `
            <div class="pin-prompt-container">
                <div class="pin-prompt-header">
                    <h3>Security Verification Required</h3>
                    <button class="close-modal" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="pin-prompt-body">
                    <p class="pin-message">${
                      this.config.MESSAGES.PIN_PROMPT
                    }</p>
                    <input 
                        type="password" 
                        id="pin-input" 
                        class="pin-input" 
                        placeholder="Enter 4-digit PIN"
                        maxlength="4"
                        inputmode="numeric"
                        autocomplete="off"
                    />
                    <p class="pin-info">
                        <i class="fas fa-lock"></i>
                        Your PIN is required for document downloads. This action is logged for security purposes.
                    </p>
                </div>
                <div class="pin-prompt-footer">
                    <button class="btn btn-secondary close-modal">Cancel</button>
                    <button class="btn btn-primary pin-submit">Verify & ${
                      action === "download" ? "Download" : "Preview"
                    }</button>
                </div>
            </div>
        `;

    // Store context
    this.currentPINContext = {
      action,
      docPath,
      docName,
      attempts: 0,
    };

    document.body.appendChild(modal);
    modal.style.display = "flex";

    // Focus on input
    setTimeout(() => document.getElementById("pin-input")?.focus(), 100);
  }

  /**
   * Submit PIN verification
   */
  submitPIN() {
    const pinInput = document.getElementById("pin-input");
    if (!pinInput) return;

    const pin = pinInput.value;

    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
      this.showPINError("PIN must be 4 digits");
      return;
    }

    this.currentPINContext.attempts++;

    // Validate PIN value
    if (!this.config.validatePIN(pin)) {
      this.log(
        `Invalid PIN attempt (${this.currentPINContext.attempts})`,
        "security"
      );

      if (
        this.currentPINContext.attempts >= this.config.SECURITY.MAX_ATTEMPTS
      ) {
        this.lockdownDownloads();
        this.closeModal();
        this.showError(this.config.MESSAGES.PIN_ATTEMPTS_EXCEEDED);
      } else {
        const remaining =
          this.config.SECURITY.MAX_ATTEMPTS - this.currentPINContext.attempts;
        this.showPINError(`Incorrect PIN. ${remaining} attempts remaining.`);
      }
      return;
    }

    // PIN verified
    this.log("PIN verified successfully", "security");
    this.closeModal();

    // Execute action
    if (this.currentPINContext.action === "download") {
      this.performDownload(
        this.currentPINContext.docPath,
        this.currentPINContext.docName
      );
    } else {
      this.showPreview(
        this.currentPINContext.docPath,
        this.currentPINContext.docName
      );
    }

    // Clear context
    this.currentPINContext = null;
  }

  /**
   * Show PIN error
   */
  showPINError(message) {
    const errorEl =
      document.querySelector(".pin-error-message") ||
      document.createElement("p");
    errorEl.className = "pin-error-message";
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    const body = document.querySelector(".pin-prompt-body");
    if (body && !document.querySelector(".pin-error-message")) {
      body.appendChild(errorEl);
    } else if (document.querySelector(".pin-error-message")) {
      document.querySelector(".pin-error-message").innerHTML =
        errorEl.innerHTML;
    }

    // Clear input
    const pinInput = document.getElementById("pin-input");
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
  }

  /**
   * RATE LIMITING AND SECURITY
   */

  /**
   * Check rate limiting
   */
  checkRateLimit(docName) {
    const now = Date.now();
    const key = `download_${docName}`;

    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }

    const attempts = this.attempts.get(key);

    // Remove old attempts outside the rate limit window
    const recentAttempts = attempts.filter((time) => now - time < 3600000); // 1 hour

    if (recentAttempts.length >= this.config.DOWNLOAD.RATE_LIMIT) {
      this.log(`Rate limit exceeded for: ${docName}`, "security");
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  /**
   * Lockdown downloads on too many failed attempts
   */
  lockdownDownloads() {
    this.log(
      "Download lockdown activated due to too many failed PIN attempts",
      "security"
    );

    // Disable all download buttons
    document.querySelectorAll(".doc-download-btn").forEach((btn) => {
      btn.disabled = true;
      btn.title = "Downloads temporarily disabled due to security concerns";
    });

    // Re-enable after cooldown
    setTimeout(() => {
      document.querySelectorAll(".doc-download-btn").forEach((btn) => {
        btn.disabled = false;
        btn.title = "";
      });
      this.log("Download lockdown lifted", "security");
    }, this.config.SECURITY.COOLDOWN_PERIOD);
  }

  /**
   * SESSION MANAGEMENT
   */

  /**
   * Create session
   */
  createSession(docPath, type) {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const session = {
      id: sessionId,
      docPath,
      type,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.SECURITY.SESSION_TIMEOUT,
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Validate session
   */
  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return false;
    }

    return true;
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Validate document path
   */
  validateDocumentPath(docPath) {
    // Check if path is in assets folder
    if (!docPath.startsWith("assets/")) {
      return false;
    }

    // Check for path traversal attempts
    if (docPath.includes("..") || docPath.includes("//")) {
      this.log(`Path traversal attempt blocked: ${docPath}`, "security");
      return false;
    }

    // Check allowed extensions
    const ext = docPath.substring(docPath.lastIndexOf(".")).toLowerCase();
    if (!this.config.SECURITY.ALLOWED_EXTENSIONS.includes(ext)) {
      return false;
    }

    return true;
  }

  /**
   * Close modals
   */
  closeModal() {
    const modals = document.querySelectorAll(
      ".document-preview-modal, .pin-prompt-modal"
    );
    modals.forEach((modal) => {
      modal.style.display = "none";
      setTimeout(() => modal.remove(), 300);
    });
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showNotification(message, "success");
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, "error");
  }

  /**
   * Show notification
   */
  showNotification(message, type = "info") {
    // Remove existing notification
    const existing = document.querySelector(".document-notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `document-notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            }"></i>
            ${message}
        `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHTML(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Get location info
   */
  getLocationInfo() {
    return {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent.substring(0, 50),
    };
  }

  /**
   * LOGGING
   */

  /**
   * Log security event
   */
  log(message, level = "info", details = {}) {
    if (!this.config.SECURITY.ENABLE_LOGGING) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      environment: this.config.getEnvironment(),
    };

    this.logs.push(logEntry);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    // Console debug logging
    if (this.config.SECURITY.DEBUG_LOGGING) {
      console.log(`[${level.toUpperCase()}] ${message}`, details);
    }

    // Send critical logs to server (optional)
    if (level === "security" || level === "error") {
      this.sendLogToServer(logEntry);
    }
  }

  /**
   * Send log to server
   */
  sendLogToServer(logEntry) {
    // Optional: Send security logs to backend
    // This could be implemented as:
    // fetch('/api/security-logs', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(logEntry)
    // }).catch(() => {}); // Fail silently
  }

  /**
   * Get all logs
   */
  getLogs(filter = {}) {
    let logs = this.logs;

    if (filter.level) {
      logs = logs.filter((l) => l.level === filter.level);
    }

    if (filter.since) {
      const sinceTime = new Date(filter.since).getTime();
      logs = logs.filter((l) => new Date(l.timestamp).getTime() > sinceTime);
    }

    return logs;
  }

  /**
   * Export logs
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Initialize document manager when DOM is ready
const documentManager = new SecureDocumentManager();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.documentManager === undefined) {
      window.documentManager = documentManager;
    }
  });
} else {
  window.documentManager = documentManager;
}
