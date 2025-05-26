import { login, logout, isAuthenticated } from "./auth.js";
import { graphqlRequest } from "./graphql.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.querySelector("form");
  const authContainer = document.querySelector(".auth-container");
  const dashboard = document.querySelector(".dashboard-container");

  if (isAuthenticated()) {
    const { data, error } = await graphqlRequest("{ user { login } }");
    if (data) showDashboard(data.user[0].login);
    else logout();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;

    const result = await login(identifier, password);

    if (result.error) {
      alert(result.error);
      return;
    }

    const { data, error } = await graphqlRequest("{ user { login } }");

    if (error) {
      console.error("GraphQL request failed after login:", error);
      logout();
      return;
    }

    showDashboard(data.user[0].login);
  });

  function showDashboard(loginName) {
    authContainer.style.display = "none";
    dashboard.style.display = "block";
    dashboard.innerHTML = `<h2>Welcome, ${loginName}</h2><button id="logoutBtn">Logout</button>`;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      logout();
      location.reload();
    });
  }
  
  // Theme Toggle Functionality
  const themeToggle = document.querySelector(".theme-toggle");
  const moonIcon = document.querySelector(".moon-icon");
  
  // Check if user has a preference stored
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  }
  
  themeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateThemeIcon(isDarkMode);
  });
  
  function updateThemeIcon(isDarkMode) {
    if (isDarkMode) {
      moonIcon.innerHTML = `
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
      moonIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }
});
