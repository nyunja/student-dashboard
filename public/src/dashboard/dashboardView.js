import { renderSidebar } from "../components/Sidebar.js";
import { renderNavbar } from "../components/Navbar.js";

export function renderDashboardLayout(userInfo) {
  const username = userInfo.user[0].login;
  const html = `
        <main class="dashboard-container">
          ${renderSidebar("/dashboard")}
          <section class="main-content">
            ${renderNavbar()}
            <div class="dashboard-content">
              <div class="welcome-message">
                <h1>Welcome, ${username}</h1>
                <p>Congratulations on completing your most recent project!</p>
              </div>
              <div class="stats-row" id="stats-row-container"></div>
              <div class="chart-section">
                <div class="section-header">
                  <h2>XP Chart</h2>
                  <div class="chart-filters">
                      <button class="active">Weekly</button>
                      <button>Monthly</button>
                  </div>
                </div>
                <div class="chart-container">
                  <svg id="xp-chart" width="100%" height="300"></svg>
                </div>
              </div>
              <div class="grid-section">
                <div class="grid-card">
                  <h3>Exercise Pass Rate</h3>
                  <div id="recent-projects" class="chart-container">
                    Loading...
                  </div>
                </div>
                <div class="grid-card">
                  <h3>Skills Progress</h3>
                  <div class="skills-progress">
                    <div class="skill-item">
                      <div class="skill-info">
                        <span>Loading...</span>
                        <span>0%</span>
                      </div>
                      <div class="progress-bar">
                        <div class="progress" stye="width: 0%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
  return html;
}
