import { renderSidebar } from "../components/Sidebar.js";

export function renderDashboardLayout() {
  const html = `
        <main class="dashboard-container">
          ${renderSidebar("/dashboard")}
          <section class="main-content">
            <header>
              <div class="search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search...">
              </div>
              <div class="user-profile">
                <div class="notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="badge">0</span>
                </div>
                <div class="user-info">
                  <span id="user-name">Loading...</span>
                  <img src="./assets/avatar_placeholder.png" alt="User avatar" class="avatar">
                </div>
              </div>
            </header>
            <div class="dashboard-content">
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
                  <h3>Recent Projects</h3>
                  <div class="table-container">
                    <table id="recent-projects">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Path</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr colspan="3">Loading...</tr>
                      </tbody>
                    </table>
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