/**
 * DOCUMENTS UI RENDERER
 * Generates the documents gallery UI dynamically
 */

class DocumentsUIRenderer {
  constructor() {
    if (typeof DocumentConfig === "undefined") {
      console.error(
        "DocumentConfig not loaded. Make sure document-config.js is loaded before documents-ui.js"
      );
      return;
    }
    this.config = DocumentConfig;
    this.gridElement = null;
    this.init();
  }

  /**
   * Initialize and render documents UI
   */
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.render());
    } else {
      this.render();
    }
  }

  /**
   * Main render method
   */
  render() {
    this.gridElement = document.getElementById("documentsGrid");
    if (!this.gridElement) return;

    // Render all document categories
    const html = this.renderCategories();
    this.gridElement.innerHTML = html;
  }

  /**
   * Render all categories
   */
  renderCategories() {
    let html = "";

    Object.entries(this.config.CATEGORIES).forEach(
      ([categoryKey, category]) => {
        if (category.files.length > 0) {
          html += this.renderCategory(categoryKey, category);
        }
      }
    );

    if (html === "") {
      html = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem; display: block;"></i>
                    <p style="color: var(--text-muted);">No documents available at this time.</p>
                </div>
            `;
    }

    return html;
  }

  /**
   * Render single category
   */
  renderCategory(categoryKey, category) {
    const categoryColor = category.color || "#6366f1";
    const documentsHtml = this.renderDocuments(category.files, category.folder);

    return `
            <div class="document-category">
                <div class="document-category-header" style="background: linear-gradient(135deg, ${categoryColor}, ${this.adjustBrightness(
      categoryColor,
      -20
    )})">
                    <i class="fas ${category.icon}"></i>
                    <div class="document-category-header-text">
                        <h3>${this.escapeHTML(category.name)}</h3>
                        <p>${this.escapeHTML(category.description)}</p>
                    </div>
                </div>
                <div class="document-category-body">
                    <ul class="documents-list">
                        ${documentsHtml}
                    </ul>
                </div>
            </div>
        `;
  }

  /**
   * Render documents list
   */
  renderDocuments(files, folder) {
    return files.map((file) => this.renderDocument(file, folder)).join("");
  }

  /**
   * Render single document item
   */
  renderDocument(file, folder) {
    const docPath = folder + file.name;
    const fileSize = this.getFileSize(file.name);

    return `
            <li class="document-item" data-doc="${file.name}">
                <div class="document-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="document-info">
                    <p class="document-name">${this.escapeHTML(
                      file.title || file.name
                    )}</p>
                    <p class="document-meta">
                        <span><i class="fas fa-file-pdf"></i> PDF</span>
                        ${
                          fileSize
                            ? `<span><i class="fas fa-database"></i> ${fileSize}</span>`
                            : ""
                        }
                        ${
                          file.category
                            ? `<span><i class="fas fa-tag"></i> ${this.escapeHTML(
                                file.category
                              )}</span>`
                            : ""
                        }
                    </p>
                </div>
                <div class="document-actions">
                    <button 
                        class="doc-preview-btn" 
                        title="Preview Document"
                        data-doc-path="${this.escapeAttribute(docPath)}"
                        data-doc-name="${this.escapeAttribute(
                          file.title || file.name
                        )}"
                    >
                        <i class="fas fa-eye"></i>
                    </button>
                    <button 
                        class="doc-download-btn" 
                        title="Download Document"
                        data-doc-path="${this.escapeAttribute(docPath)}"
                        data-doc-name="${this.escapeAttribute(file.name)}"
                    >
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </li>
        `;
  }

  /**
   * Get file size (can be enhanced with actual file metadata)
   */
  getFileSize(fileName) {
    // This is a placeholder. In production, get actual file sizes from server
    const sizes = {
      small: "< 1 MB",
      medium: "1-5 MB",
      large: "> 5 MB",
    };
    // Return random for demo
    return sizes.medium;
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
   * Escape HTML attributes
   */
  escapeAttribute(text) {
    return text.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  /**
   * Adjust color brightness
   */
  adjustBrightness(color, percent) {
    // Convert hex to RGB
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}

// Initialize when DOM is ready
const documentsUIRenderer = new DocumentsUIRenderer();
