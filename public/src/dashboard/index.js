import StatsCard from "../components/StatsCard.js";
import { themeManager } from "../components/ThemeManager.js";
import { GraphQLService } from "../services/graphqlService.js";
import { fetchAndPoplulateDashboardData } from "./dashboardDataHandler.js";
import { renderDashboardLayout } from "./dashboardView.js";

export const mainApp = document.querySelector(".main-app-container");

const graphQLService = new GraphQLService();

let totalXPCard;
let completedExercisesCard;
let averageGradeCard;

/**
 * Displays the dashboard for the given user.
 * @param {object} userInfo - The user's information object.
 * @param {function} onLogout - The logout handler from app.js.
 */
export async function displayDashboard(userInfo, onLogout) {
  mainApp.innerHTML = renderDashboardLayout();
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

  // Attach logout event listener
  const logoutButton = mainApp.querySelector(".logout-button");
  if (logoutButton && typeof onLogout === "function") {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      onLogout();
    });
  }

  // Set up theme toggle
  themeManager.setupThemeToggle();

  // Fetch and populate dashboard data
  await fetchAndPoplulateDashboardData(
    userInfo,
    totalXPCard,
    completedExercisesCard,
    averageGradeCard
  );
}
