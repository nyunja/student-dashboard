import { login, logout, isAuthenticated } from "./auth.js";
import { graphqlRequest } from "./graphql.js";
import { renderDashboardLayout, showDashboard } from "./dashboard.js";

const mainApp = document.querySelector(".main-app-container");

function renderLoginForm() {
  mainApp.innerHTML = `
        <main class="auth-container">
        <!-- Left side - Login Form -->
        <section class="login-container">
            <div class="login-form">
                <div class="logo-container">
                    <div class="login-logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="login-logoTitle">
                            <title id="login-logoTitle">GraphQL Progress Tracker Logo</title>
                            <path
                                d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M15 15H15.01M25 15H25.01M15 25H25" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <h1 class="logo-text">Log In To GraphQL Progress Tracker</h1>
                </div>
                <form>
                    <div class="input-group">
                        <label for="identifier">Username or Email</label>
                        <input type="text" id="identifier" name="identifier" required>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
            </div>
        </section>
        <!-- Right side - Branding -->
        <section class="branding-container">
            <div class="circle-bg"></div>
            <div class="branding-content">
                <h2 class="branding-title">Visualize Your Progress. Own Your Dev Journey!</h2>
                <p class="branding-text">
                    Log in to access your personalized profile and track your coding journey with real-time data and interactive stats.
                </p>
            </div>
        </section>
    </main>
     <!-- Theme Toggle Button -->
    <button class="theme-toggle" aria-label="Toggle theme">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>
  `;
  const loginForm = document.querySelector("form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const identifier = document.getElementById("identifier").value;
      const password = document.getElementById("password").value;

      const result = await login(identifier, password);

      if (result.error) {
        alert(result.error);
        return;
      }

      const { data, error } = await graphqlRequest(
        `{ user { id login attrs } }`
      );

      if (error) {
        alert("Login succeeded but Graphql failed. Please try again.");
        console.error("GraphQL request failed after login:", error);
        logout();
        return;
      }

      showDashboard(data.user[0].login, data.user[0].id, data.user[0].attrs);
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const authContainer = document.querySelector(".auth-container");
  const dashboard = document.querySelector(".dashboard-container");

  if (isAuthenticated()) {
    const { data, error } = await graphqlRequest("{ user { login } }");
    if (data && data.user && data.user.length > 0) {
      console.log("Authenticated user data:", data.user);
      showDashboard(data.user[0].login, data.user[0].id, data.user[0].attrs);
    } else {
      console.error(
        "Graphql failed to fetch use data on authenticated load: ",
        error
      );
      logout();
      renderLoginForm();
    }
  } else {
    console.log("User is not authenticated");
    renderLoginForm();
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
