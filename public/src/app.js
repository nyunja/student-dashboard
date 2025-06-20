import AuthService from "./services/authService.js";
import { displayDashboard, showProfile } from "./dashboard/index.js";
import { themeManager } from "./components/ThemeManager.js";
import { GraphQLService } from "./services/graphqlService.js";
import { Router } from "./services/router.js";

const mainApp = document.querySelector(".main-app-container");

const graphqlService = new GraphQLService();
const authService = new AuthService();
const router = new Router();

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
                <div id="login-error" class="error-message hidden"></div>
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
  const loginError = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const identifier = document.getElementById("identifier").value;
      const password = document.getElementById("password").value;

      // Clear any previous error messages
      loginError.textContent = "";
      loginError.classList.add("hidden");
      
      // Show loading state on button
      const submitButton = loginForm.querySelector("button[type='submit']");
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = "Logging in...";
      submitButton.disabled = true;

      const result = await authService.login(identifier, password);

      // Reset button state
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      if (result.error) {
        // Display error message
        loginError.textContent = result.error;
        loginError.classList.remove("hidden");
        return;
      }

      try {
        const userInfoData = await graphqlService.getUserInfo();
        const user = userInfoData;
        router.navigate("/dashboard", user, handleLogout);
      } catch (error) {
        console.error("Error fetching user info after login: ", error);
        loginError.textContent = "Login successful but failed to fetch user data. Please try again.";
        loginError.classList.remove("hidden");
        authService.logout();
      }
    });
  }
  themeManager.setupThemeToggle();
}

function handleLogout() {
  authService.logout();
  router.navigate("/login");
}

router.addRoute("/login", renderLoginForm);
router.addRoute("/dashboard", (userInfo) => displayDashboard(userInfo, handleLogout, router));
router.addRoute("/profile", (userInfo) => showProfile(userInfo, handleLogout, router));

router.setNotFoundHandler(() => {
  mainApp.innerHTML = `
  <div style="text-align: center; padding: 50px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p><a href="/" id="go-to-login">Go to Login</a></p>
  </div>
  `;
  document.addEventListener('click', (event) => {
    event.preventDefault();
    router.navigate("/login");
  })
});

document.addEventListener("DOMContentLoaded", async () => {

  if (authService.isAuthenticated()) {
    try {
      const userInfo = await graphqlService.getUserInfo();
      if (userInfo) {
        console.log("Authenticated user data:", userInfo);
        if (!router.routes.has(window.location.pathname) && window.location.pathname !== "/" && window.location.pathname !== "/login") {
          router.notFoundHandler();
        } else {
          const currentPath = window.location.pathname;
          if (currentPath === "/" || currentPath === "/login") {
            router.navigate("/dashboard", userInfo, handleLogout);
          } else {
            router.navigate(currentPath, userInfo, handleLogout);
          }
        }
      } else {
        console.error(
          "Graphql failed to fetch use data on authenticated load: ",
          error
        );
        authService.logout();
        router.navigate("/login");
      }
      
    } catch (error) {
      
    }
  } else {
    console.log("User is not authenticated");
    if (window.location.pathname !== '/login') {
      router.navigate("/login");
    } else {
      router.handleRoute('/login');
    }
  }
});
