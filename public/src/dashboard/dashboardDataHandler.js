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

    console.log("<<<<<<<<<<<<<<<<<< progress", userInfo.progress);

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
    const recentItems = completedExercises.pendingProgress;
    const passed = recentItems.filter((item) => item.grade >= 1).length;
    const failed = recentItems.length - passed;
    const passRatio = recentItems.length > 0 ? (passed / recentItems.length) * 100 : 0;

    createPassFailDonutChart(passRatio, 'recent-projects', passed, failed);

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
    // recentExercisesTable.querySelector("tbody").innerHTML = tableHTML;


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

function createPassFailDonutChart(passRatio, elementId, passed, failed) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = '';

  const chartContainer = document.createElement('div');
  chartContainer.className = 'donut-chart-container';
  
  // Create SVG for donut chart
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "600");
  svg.setAttribute("height", "600");
  svg.setAttribute("viewBox", "0 0 100 100");

    // Calculate circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const passStrokeDasharray = (passRatio / 100) * circumference;
  const failStrokeDasharray = circumference - passStrokeDasharray;

  // Create background circle (fail portion)
  const failCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  failCircle.setAttribute("cx", "50");
  failCircle.setAttribute("cy", "50");
  failCircle.setAttribute("r", radius);
  failCircle.setAttribute("fill", "none");
  failCircle.setAttribute("stroke", "var(--secondary-color)");
  failCircle.setAttribute("stroke-width", "18");

  // Create foreground circle (pass portion)
  const passCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  passCircle.setAttribute("cx", "50");
  passCircle.setAttribute("cy", "50");
  passCircle.setAttribute("r", radius);
  passCircle.setAttribute("fill", "none");
  passCircle.setAttribute("stroke", "var(--primary-color)");
  passCircle.setAttribute("stroke-width", "18");
  passCircle.setAttribute("stroke-dasharray", `${passStrokeDasharray} ${failStrokeDasharray}`);
  passCircle.setAttribute("transform", "rotate(-90 50 50)");

  // Add text in the center
  const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  percentText.setAttribute("x", "50");
  percentText.setAttribute("y", "45");
  percentText.setAttribute("text-anchor", "middle");
  percentText.setAttribute("dominant-baseline", "middle");
  percentText.setAttribute("font-size", "15");
  percentText.setAttribute("font-weight", "bold");
  percentText.setAttribute("fill", "var(--text-color)");
  percentText.textContent = `${Math.round(passRatio)}%`;
  
  // Add label text
  const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  labelText.setAttribute("x", "50");
  labelText.setAttribute("y", "60");
  labelText.setAttribute("text-anchor", "middle");
  labelText.setAttribute("font-size", "8");
  labelText.setAttribute("fill", "var(--text-light)");
  labelText.textContent = "Pass Rate";

  // Append elements to SVG
  svg.appendChild(failCircle);
  svg.appendChild(passCircle);
  svg.appendChild(percentText);
  svg.appendChild(labelText);

  const legend = document.createElement('div');
  legend.className = `
    <div class="legend-item">
      <span class="legend-color" style="background-color: var(--primary-color)"></span>
      <span>Pass (${passed})</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style="background-color: var(--secondary-color)"></span>
      <span>Fail (${failed})</span>
    </div>
  `;

  // Append SVG and legend to container
  chartContainer.appendChild(svg);
  chartContainer.appendChild(legend);
  container.appendChild(chartContainer);
}

function createXPChart(transaction, chartElementId = "xp-chart") {
  const xpByDay = {};
  transaction.forEach((t) => {
    const date = new Date(t.createdAt);
    const isoDate = date.toISOString().split('T')[0];
    xpByDay[isoDate] = (xpByDay[isoDate] || 0) + t.amount;
  });
  const dates = Object.keys(xpByDay).sort();

  let cumulativeXp = 0;
  const values = dates.map(date => {
    cumulativeXp += xpByDay[date];
    return cumulativeXp;
  });
  // const values = dates.map((date) => xpByDay[date]);
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
  });

  // Create line chart overlay
  let pathData = ""
  values.forEach((value, i) => {
    const x = i * scaleX;
    const y = chartHeight - value * scaleY;

    if (i === 0) {
      pathData += `M ${x} ${y}`
    } else {
      pathData += ` L ${x} ${y}`
    }
  })

  // Create path element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("d", pathData)
  path.setAttribute("stroke", "var(--chart-color-2)")
  path.setAttribute("stroke-width", "3")
  path.setAttribute("fill", "none")
  chartGroup.appendChild(path)

  // Add dots at each data point
  values.forEach((value, i) => {
    const x = i * scaleX;
    const y = chartHeight - value * scaleY;

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    dot.setAttribute("cx", x)
    dot.setAttribute("cy", y)
    dot.setAttribute("r", "5")
    dot.setAttribute("fill", "var(--chart-color-2)")
    dot.setAttribute("stroke", "white")
    dot.setAttribute("stroke-width", "2")
    chartGroup.appendChild(dot)
  })
}
