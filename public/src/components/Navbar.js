export function renderNavbar() {
  const html = `
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
    `;
    return html
}

export function setupHeaderEventListener(userInfo, router) {
    // Update user name and attach click listener for profile
  const userNameDisplay = document.getElementById("user-name");
  if (userNameDisplay) {
    userNameDisplay.textContent = userInfo.user[0].login;
    userNameDisplay.style.cursor = "pointer";
    userNameDisplay.addEventListener("click", () => {
      router.navigate("/profile", userInfo);
    });
  }
}