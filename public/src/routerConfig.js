import { Router } from "./services/router";

/**
 * Configures the applications routes
 * @param {Router} router
 * @param {Function} renderLoginForm
 * @param {Function} displayDashboard
 * @param {Function} showProfile
 * @param {Function} handleLogout
 * @param {HTMLElement} mainApp
 */
export function configureRouter(
  router,
  renderLoginForm,
  displayDashboard,
  showProfile,
  handleLogout,
  mainApp
) {
  router.addRoute("/login", renderLoginForm);
  router.addRoute("/dashboard", (userInfo) =>
    displayDashboard(userInfo, handleLogout, router)
  );
  router.addRoute("/profile", (userInfo) =>
    showProfile(userInfo, handleLogout, router)
  );

  router.setNotFoundHandler(() => {
    mainApp.innerHTML = `
  <div style="text-align: center; padding: 50px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p><a href="/" id="go-to-login">Go to Login</a></p>
  </div>
  `;
    document.addEventListener("click", (event) => {
      event.preventDefault();
      router.navigate("/login");
    });
  });
}
