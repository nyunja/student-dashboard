import { renderSidebar } from "../components/Sidebar.js";
import { renderNavbar } from "../components/Navbar.js";

export function renderProfileLayout(userInfo) {
  const username = userInfo.user[0].login;
  const attrs = userInfo.user && userInfo.user[0] ? userInfo.user[0].attrs || {}: {};
  const email = userInfo.user && userInfo.user[0] ? userInfo.user[0].email || 'N/A' : 'N/A';
  const auditRatio = userInfo.user[0].auditRatio !== undefined ? (userInfo.user[0].auditRatio * 100).toFixed(2) + '%' : 'N/A';

  const html = `
    <main class="profile-container dashboard-container">
      ${renderSidebar("/profile")}

        <section class="main-content">
        ${renderNavbar()}

        <div class="dashboard-grid">
          <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img src="./assets/avatar_placeholder.png" alt="${username}'s avatar">
                    </div>
                    <div class="profile-title">
                        <h2>${username}</h2>
                        <p>${email}</p>
                    </div>
                </div>
                <div class="profile-body">
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-value">${auditRatio}</span>
                            <span class="stat-label">Audit Ratio</span>
                        </div>
                    </div>
                    <div class="profile-info">
                        <h3>Personal Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">First Name</span>
                                <span class="info-value">${attrs.firstName || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Last Name</span>
                                <span class="info-value">${attrs.lastName || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Middle Name</span>
                                <span class="info-value">${attrs.middleName || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Gender</span>
                                <span class="info-value">${attrs.gender || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Phone</span>
                                <span class="info-value">${attrs.phone || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Country</span>
                                <span class="info-value">${attrs.country || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">ID Number</span>
                                <span class="info-value">${attrs["ID.NUMBER"] || 'N/A'}</span>
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