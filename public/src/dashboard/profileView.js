import { renderSidebar } from "../components/Sidebar.js";

export function renderProfileLayout(userInfo) {
  const attrs = userInfo.user[0].attrs || {};
  const dob = attrs.dateOfBirth ? new Date(attrs.dateOfBirth).toLocaleDateString() : 'N/A';

  const html = `
    <main class="profile-container dashboard-container">
      ${renderSidebar("/profile")}

      <section class="main-content">
        <header class="main-header">
            <div class="welcome-message">
              <h1>User Profile</h1>
              <p>Details for ${userInfo.user[0].login}</p>
            </div>
            <div class="header-actions">
              <div class="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
            </div>
        </header>

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
                    <div class="detail-item"><strong>Date of Birth:</strong> <span>${dob}</span></div>
                    <div class="detail-item"><strong>ID Number:</strong> <span>${attrs["ID.NUMBER"] || 'N/A'}</span></div>
                    <div class="detail-item"><strong>Audit Ratio:</strong> <span>${userInfo.auditRatio !== undefined ? (userInfo.auditRatio * 100).toFixed(2) + '%' : 'N/A'}</span></div>
                </div>
            </div>
        </div>
      </section>
    </main>
  `;
  return html;
}