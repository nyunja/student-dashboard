export class ThemeManager {
  constructor() {
    this.themeToggle = null;
    this.moonIcon = null;
    this.initialise();
  }

  // Initialise them based on stored preferences
  initialise() {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  }

  // Set up theme toggle functionality
  setupThemeToggle() {
    this.themeToggle = document.querySelector(".theme-toggle");
    this.moonIcon = document.querySelector(".moon-icon");

    if (!this.themeToggle || !this.moonIcon) {
      console.warn("Theme toggle elements not found");
      return;
    }

    const isDarkMode = document.body.classList.contains("dark-mode");
    this.updateThemeIcon(isDarkMode);

    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  // Toggle between light and dark themes
  toggleTheme() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    this.updateThemeIcon(isDarkMode);
  }

  /**
   * Update the theme toggle icon based on the current theme
   * @param {boolean} isDarkMode - Whether dark mode is active
   */
  updateThemeIcon(isDarkMode) {
    if (!this.moonIcon) return;

    if (isDarkMode) {
      // Sun icon for dark mode (clicking will switch to light)
      this.moonIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    } else {
      // Moon icon for light mode (clicking will switch to dark)
      this.moonIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  }

  /**
   * Get current theme
   * @returns {string} 'dark' or 'light'
   */
  getCurrentTheme() {
    return document.body.classList.contains("dark-mode") ? "dark" : "light";
  }
}

export const themeManager = new ThemeManager();
