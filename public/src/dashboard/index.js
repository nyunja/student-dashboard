import StatsCard from "../components/StatsCard.js";
import { themeManager } from "../components/ThemeManager.js";
import { GraphQLService } from "../services/graphqlService.js";
import { fetchAndPoplulateDashboardData } from "./dashboardDataHandler.js";
import { renderDashboardLayout } from "./dashboardView.js";
import { renderProfileLayout } from "./profileView.js";
import { setupSidebarEventListeners } from "../components/Sidebar.js";

export const mainApp = document.querySelector(".main-app-container");

let totalXPCard;
let completedExercisesCard;
let averageGradeCard;

/**
 * Displays the dashboard for the given user.
 * @param {object} userInfo - The user's information object.
 * @param {function} onLogout - The logout handler from app.js.
 */
export async function displayDashboard(userInfo, onLogout, router) {
  mainApp.innerHTML = renderDashboardLayout(userInfo);
  // Create and instance of a stats card with stats
  const statsContainer = document.getElementById("stats-row-container");
  if (statsContainer) {
    totalXPCard = new StatsCard("Total XP", "0", "total-xp-display");
    completedExercisesCard = new StatsCard(
      "Completed Exercises",
      "0",
      "completed-exercises-display"
    );
    averageGradeCard = new StatsCard(
      "Average Grade",
      "0%",
      "average-grade-display"
    );

    statsContainer.appendChild(totalXPCard.render());
    statsContainer.appendChild(completedExercisesCard.render());
    statsContainer.appendChild(averageGradeCard.render());
  }

  // Update user name and attach click listener for profile
  const userNameDisplay = document.getElementById("user-name");
  if (userNameDisplay) {
    userNameDisplay.textContent = userInfo.user[0].login;
    userNameDisplay.style.cursor = "pointer"; // Indicate it's clickable
    userNameDisplay.addEventListener("click", () => {
      router.navigate("/profile", userInfo);
    });
  }

  setupSidebarEventListeners(userInfo, onLogout, router);

  themeManager.setupThemeToggle();

  // Fetch and populate dashboard data
  await fetchAndPoplulateDashboardData(
    userInfo,
    totalXPCard,
    completedExercisesCard,
    averageGradeCard
  );
}

/**
 * Displays the user profile page.
 * @param {object} userInfo - The user's information object.
 * @param {function} onLogout - The logout handler from app.js.
 */
export function showProfile(userInfo, onLogout, router) {
  console.log("Showing profile for user:", userInfo.login);
  mainApp.innerHTML = renderProfileLayout(userInfo);

  setupSidebarEventListeners(userInfo, onLogout, router);

  themeManager.setupThemeToggle();
}
