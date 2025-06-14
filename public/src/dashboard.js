import AuthService from "./services/authService.js";
import StatsCard from "./components/StatsCard.js"
import { themeManager } from "./components/ThemeManager.js";
import { GraphQLService } from "./services/graphqlService.js";

export const mainApp = document.querySelector(".main-app-container");

const graphQLService = new GraphQLService();
const authService = new AuthService();

let totalXPCard;
let completedExercisesCard;
let averageGradeCard;

export function renderDashboardLayout(onLogout) {
  mainApp.innerHTML = `
      <main class="dashboard-container">
        <section class="sidebar">
          <div class="dash-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 15H15.01M25 15H25.01M15 25H25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Student Profile</span>
          </div>
          <div class="sidebar-title">Dashboard</div>
          <nav>
            <a href="#" class="active">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Dashboard
            </a>
            <a href="#">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Projects
            </a>
            <a href="#">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            Exercises
            </a>
            <a href="#">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Progress
            </a>
            <a href="/" id="logoutBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="17 16 22 12 17 8"></polyline>
                <line x1="22" y1="12" x2="10" y2="12"></line>
              </svg>
              Logout
            </a>
          </nav>
        </section>
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
                      <tr colspan="3">Loading</tr>
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

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      authService.logout();
      onLogout();
      // renderLoginForm();
    });
  }

  // Create and instance of a stats card with stats
  const statsContainer = document.getElementById('stats-row-container');
  if (statsContainer) {
    totalXPCard = new StatsCard("Total XP", "0", "total-xp-display");
    completedExercisesCard = new StatsCard("Completed Exercises", "0", "completed-exercises-display");
    averageGradeCard = new StatsCard("Average Grade", "0%", "average-grade-display");

    statsContainer.appendChild(totalXPCard.render());
    statsContainer.appendChild(completedExercisesCard.render());
    statsContainer.appendChild(averageGradeCard.render());
  }

  themeManager.setupThemeToggle();
}

export async function showDashboard(userInfo, onLogout) {
  console.log("Showing dashboard for user:", userInfo.user[0].login);
  renderDashboardLayout(onLogout);

  document.getElementById("user-name").textContent = userInfo.user[0].login;
  await fetchAndPoplulateDashboard(userInfo);
}

async function fetchAndPoplulateDashboard(userInfo) {
  console.log(`Fetching dashboard data for ${ userInfo.user[0].login} (ID: ${ userInfo.user[0].id})...`);
  try {
    const [xpData, completedExercises, skillsData] = await Promise.all([
      graphQLService.getUserXP(),
      graphQLService.getCompletedExercises(userInfo.user[0].id),
      graphQLService.getUserSkills(),
    ]);

    const totalXPValue = xpData.transaction.filter(t => t.type === "xp").reduce((sum, t) => sum + t.amount, 0);
    totalXPCard.updateStat(totalXPValue.toLocaleString() + " XP");

    const completedCount = completedExercises.pendingProgress.length;
    completedExercisesCard.updateStat(completedCount.toString());

    const grades = userInfo.progress.map(p => p.grade).filter(g => g !== null);
    const averageGrade = grades.length > 0 ? ((grades.reduce((sum, grade) => sum + grade, 0) / grades.length) *100).toFixed(1) + "%" : "N/A";
    averageGradeCard.updateStat(averageGrade);

    // Populate skills progress
    const skillsProgressContainer = document.querySelector(".skills-progress");
    skillsProgressContainer.innerHTML = '';

    if (skillsData && skillsData.user && skillsData.user[0] && skillsData.user[0].skills) {
      const skills = skillsData.user[0].skills;
      const aggregatedSkills = new Map();
      skills.forEach((skill) => {
        const skillName = skill.type.replace("skill_", "").replace(/_/g, " ").toUpperCase();
        const skillAmount = skill.amount;
        if (!aggregatedSkills.has(skillName) || skillAmount > aggregatedSkills.get(skillName).amount) {
          aggregatedSkills.set(skillName, {name: skillName, amount: skillAmount});
        }
      });

      const sortedSkills = Array.from(aggregatedSkills.values()).sort((a, b) => a.amount > b.amount);

      if (sortedSkills.length > 0) {
        sortedSkills.forEach((skill) => {
          const progressPercentage = Math.floor(skill.amount);
          const skillItemHTML = 
          `
          <div class="skill-item">
            <div class="skill-info">
              <span>${skill.name}</span>
              <span>${progressPercentage}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${progressPercentage}%"></div>
            </div>
          </div>`;
          skillsProgressContainer.insertAdjacentHTML('beforeend', skillItemHTML);
        });
      } else {
        skillsProgressContainer.innerHTML = '<div class="skill-item">No skills data available.</div>';
      }
    } else {
      skillsHTML = `<div class="skill-item">No skills data available.</div>`;
    }

    // Create XP chart
    createXPChart(xpData.transaction.filter(t => t.type === "xp"));
  } catch (error){
    console.error("Error fetching or populating dashboard data:", error);
    // alert("Failed to load dashboard data. Please check your network or try again.");
  }
}

function createXPChart(transaction, chartElementId = "xp-chart") {
  const xpByDay = {};
  transaction.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString();
    xpByDay[date] = (xpByDay[date] || 0) + t.amount;
  });
  const dates = Object.keys(xpByDay).sort((a, b) => new Date(a) - new Date(b)).slice(-7);
  const values = dates.map((date) => xpByDay[date]);
  const maxValue = Math.max(...values, 1000);

  const xpChart = document.getElementById(chartElementId);
  if (!xpChart) return;

  const width = xpChart.clientWidth;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50};
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  xpChart.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  xpChart.appendChild(svg);

  const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  chartGroup.setAttribute("transform", `translate(${padding.left}, ${padding.top})`);
  svg.appendChild(chartGroup);

  const scaleX = chartWidth / (dates.length -1 || 1);
  const scaleY = chartHeight/ maxValue;

  // Create grid lines
  for (let i = 0; i <= 5; i++) {
    const y = chartHeight - (i * chartHeight) / 5;
    const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gridLine.setAttribute("x1", 0);
    gridLine.setAttribute("y1", y);
    gridLine.setAttribute("x2", chartWidth);
    gridLine.setAttribute("y2", y);
    gridLine.setAttribute("stroke", "var(--border-color)");
    gridLine.setAttribute("stroke-width", "1");
    gridLine.setAttribute("stroke-dasharray", "5,5");
    chartGroup.appendChild(gridLine);

    // Add y-axis labels
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", -10);
    label.setAttribute("y", y + 5);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", "var(--text-light)");
    label.setAttribute("font-size", "12");
    label.textContent = Math.round((i * maxValue) / 5);
    chartGroup.appendChild(label);
  }

  // Create x-axis labels
  dates.forEach((date, i) => {
    const x = i * scaleX;
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", chartHeight + 20);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "var(--text-light)");
    label.setAttribute("font-size", "12");

    // Format date to show only day and month
    const formattedDate = new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    label.textContent = formattedDate;
    chartGroup.appendChild(label);
  });

    // Create bar chart
  values.forEach((value, i) => {
    const x = i * scaleX;
    const barHeight = value * scaleY;
    const y = chartHeight - barHeight

    // Create bar
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    bar.setAttribute("x", x - 15)
    bar.setAttribute("y", y)
    bar.setAttribute("width", 30)
    bar.setAttribute("height", barHeight)
    bar.setAttribute("fill", "var(--chart-color-1)")
    bar.setAttribute("rx", "4")
    chartGroup.appendChild(bar)

    // Create value label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
    label.setAttribute("x", x)
    label.setAttribute("y", y - 10)
    label.setAttribute("text-anchor", "middle")
    label.setAttribute("fill", "var(--text-color)")
    label.setAttribute("font-size", "12")
    label.textContent = value
    chartGroup.appendChild(label)
  });
}