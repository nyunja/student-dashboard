import { ICONS } from "../constants.js";

class StatsCard {
    constructor(title, initialValue, elementId) {
        this.title = title;
        this.value = initialValue;
        this.elementId = elementId;
        this.domElement = null;
    }

    // Render HTML structure of the stat card so it can be appended to the DOM
    render() {
        let iconColor = 'green';
        let icon = ICONS.XP_LOGO;
        if (this.elementId === 'completed-exercises-display') {iconColor = 'blue'; icon = ICONS.COMPLETED_ICON};
        if (this.elementId === 'average-grade-display') {iconColor = 'purple'; icon = ICONS.AVERAGE_ICON};
        this.domElement = document.createElement('div');
        this.domElement.className = 'stats-card';
        this.domElement.innerHTML = `
            <div class="stats-info">
                <div class="stats-label">${this.title}</div>
                <div class="stats-value" id="${this.elementId}">${this.value}</div>
            </div>
            <div class="stats-icon ${iconColor}">${icon}</div>
        `;
        return this.domElement;
    }

    // Update the value shown on the stat card
    updateStat(newValue) {
        this.value = newValue;
        if (this.domElement) {
            const valueSpan = this.domElement.querySelector(`#${this.elementId}`);
            if (valueSpan) {
                valueSpan.textContent = newValue;
            }
        }
    }
}

export default StatsCard;