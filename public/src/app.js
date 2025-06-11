import AuthService from "./services/authService.js";
import { showDashboard } from "./dashboard.js";
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

      const result = await authService.login(identifier, password);

      if (result.error) {
        alert(result.error);
        return;
      }

      try {
        const userInfoData = await graphqlService.getUserInfo();
        const user = userInfoData;
        router.navigate("/dashboard", user);
        // showDashboard(user);
      } catch (error) {
        console.error("Error fetching user info after login: ", error);
        // alert("Login successful but failed to fetch user data. Please try again.");
        authService.logout();
        router.navigate("/");
      }
    });
  }
  themeManager.setupThemeToggle();
}

function handleLogout() {
  authService.logout();
  router.navigate("/");
}

router.addRoute("/", renderLoginForm);
router.addRoute("/dashboard", (userInfo) => showDashboard(userInfo, handleLogout));

router.setNotFoundHandler(() => {
  mainApp.innerHTML = `
  <div style="text-align: center; padding: 50px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p><a href="/" onclick="event.preventDefault(); router.navigate('/login');">Go to Login</a></p>
  </div>
  `;
})

document.addEventListener("DOMContentLoaded", async () => {
  
  // const authContainer = document.querySelector(".auth-container");
  // const dashboard = document.querySelector(".dashboard-container");

  if (authService.isAuthenticated()) {
    const userInfo = await graphqlService.getUserInfo();
    if (userInfo) {
      console.log("Authenticated user data:", userInfo);
      router.navigate("/dashboard", userInfo);
      // showDashboard(userInfo);
    } else {
      console.error(
        "Graphql failed to fetch use data on authenticated load: ",
        error
      );
      authService.logout();
      router.navigate("/");
      // renderLoginForm();
    }
  } else {
    console.log("User is not authenticated");
    router.navigate("/");
  }
});
