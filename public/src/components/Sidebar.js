/**
 *
 * @param {string} currentPath - The current active path (e.g. '/dashboard')
 * @returns {string} The html string for the side bar.
 */
export function renderSidebar(currentPath) {
  const html = `
        <section class="sidebar">
            <div class="dash-logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15 15H15.01M25 15H25.01M15 25H25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>Student Profile</span>
            </div>
            <nav class="sidebar-nav">
            
                    <a href="/dashboard" class="nav-item ${
                      currentPath === "/dashboard" ? "active" : ""
                    }" data-path="/dashboard">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                    </span>
                    <span class="nav-text">Dashboard</span>
                    </a>

                    <a href="/profile" class="nav-item ${
                      currentPath === "/profile" ? "active" : ""
                    }" data-path="/profile">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <span class="nav-text">Profile</span>
                    </a>
                
                    <a href="#" class="nav-item logout-button">
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </span>
                    <span class="nav-text">Logout</span>
                    </a>
                
              
            </nav>
    </section>
    `;
  return html;
}

/**
 * Attaches event listeners to the sidebar elements after it rendered.
 * @param {function} onLogout - The callback function for logging out.
 */
export function setupSidebarEventListeners(userInfo, onLogout, router) {
  const sidebarItems = document.querySelectorAll(
    ".sidebar .nav-item[data-path]"
  );
  sidebarItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const path = item.dataset.path;
      router.navigate(path, userInfo);
    });
  });

  const logoutButton = document.querySelector(".sidebar .logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof onLogout === "function") {
        onLogout();
      }
    });
  }
}
