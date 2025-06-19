import { GraphQLService } from "../services/graphqlService.js";

const graphQLService = new GraphQLService();

export async function fetchAndPoplulateDashboardData(
  userInfo,
  totalXPCard,
  completedExercisesCard,
  averageGradeCard
) {
  try {
    const [xpData, completedExercises, skillsData] = await Promise.all([
      graphQLService.getUserXP(),
      graphQLService.getCompletedExercises(userInfo.user[0].id),
      graphQLService.getUserSkills(),
    ]);

    const totalXPValue = xpData.transaction
      .filter((t) => t.type === "xp")
      .reduce((sum, t) => sum + t.amount, 0);
    totalXPCard.updateStat(totalXPValue.toLocaleString() + " XP");

    const completedCount = completedExercises.pendingProgress.length;
    completedExercisesCard.updateStat(completedCount.toString());

    const grades = userInfo.progress
      .map((p) => p.grade)
      .filter((g) => g !== null);
    const averageGrade =
      grades.length > 0
        ? (
            (grades.reduce((sum, grade) => sum + grade, 0) / grades.length) *
            100
          ).toFixed(1) + "%"
        : "N/A";
    averageGradeCard.updateStat(averageGrade);

    // --- Populate Recent Projects Table ---
    const recentExercisesTable = document.getElementById("recent-projects");
    const recentItems = completedExercises.pendingProgress
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    let tableHTML = "";
    if (recentItems.length > 0) {
      recentItems.forEach((item) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        const status = "Passed"; // Or fetch actual grade if available in pendingProgress
        const statusClass = "text-success"; // Default to success for completed

        tableHTML += `
          <tr>
            <td>${item.path.split('/').pop().split('-').map((part) => {
              return part[0].toUpperCase() + part.slice(1);
            }).join(' ')}</td> <td>${item.path}</td>
            <td class="${statusClass}">${status}</td>
          </tr>
        `;
      });
    } else {
      tableHTML = `<tr><td colspan="3">No recent completed exercises.</td></tr>`;
    }
    console.log("<<<<<<<<<<<<<<<<<<<<<<", recentExercisesTable.querySelector("tbody").innerHTML);
    recentExercisesTable.querySelector("tbody").innerHTML = tableHTML;


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

      const sortedSkills = Array.from(aggregatedSkills.values()).sort((a, b) => a.amount > b.amount).slice(0, 10);

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
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
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
