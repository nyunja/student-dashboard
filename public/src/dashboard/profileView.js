import { renderSidebar } from "../components/Sidebar.js";
import { renderNavbar } from "../components/Navbar.js";

export function renderProfileLayout(userInfo) {
  const attrs = userInfo.user[0].attrs || {};

  const html = `
    <main class="profile-container dashboard-container">
      ${renderSidebar("/profile")}

        <section class="main-content">
        ${renderNavbar()}

        <div class="dashboard-grid">
            <div class="grid-card full-width">
                <h3>Personal Information</h3>
                <div class="profile-details-grid">
                    <div class="detail-item"><strong>Login:</strong> <span>${userInfo.user[0].login || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Email:</strong> <span>${userInfo.user[0].email || 'N/A'}</span></div>
                    <div class="detail-item"><strong>First Name:</strong> <span>${attrs.firstName || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Last Name:</strong> <span>${attrs.lastName || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Middle Name:</strong> <span>${attrs.middleName || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Gender:</strong> <span>${attrs.gender || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Phone:</strong> <span>${attrs.phone || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Country:</strong> <span>${attrs.country || 'N/A'}</span></div>
                    <div class="detail-item"><strong>ID Number:</strong> <span>${attrs["ID.NUMBER"] || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Audit Ratio:</strong> <span>${userInfo.auditRatio !== undefined ? (userInfo.auditRatio * 100).toFixed(2) + '%' : 'N/A'}</span></div>
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