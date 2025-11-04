"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestFrequency = getClosestFrequency;
const budgetFrequencyEnum = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
const frequencyToDays = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    quarterly: 90,
    yearly: 365,
};
function getClosestFrequency(value) {
    let closest = 'weekly';
    let minDiff = Infinity;
    for (const [freq, days] of Object.entries(frequencyToDays)) {
        const diff = Math.abs(value - days);
        if (diff < minDiff) {
            minDiff = diff;
            closest = freq;
        }
    }
    return closest;
}
//# sourceMappingURL=closest-frequency.js.map