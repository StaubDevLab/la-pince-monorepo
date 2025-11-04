"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFrequencyToDayjsPeriod = convertFrequencyToDayjsPeriod;
const frequencyToDayjsPeriod = {
    weekly: { value: 1, unit: 'week' },
    biweekly: { value: 2, unit: 'week' },
    monthly: { value: 1, unit: 'month' },
    quarterly: { value: 3, unit: 'month' },
    yearly: { value: 1, unit: 'year' },
};
function convertFrequencyToDayjsPeriod(frequency) {
    if (typeof frequency === 'number') {
        return { value: frequency, unit: 'day' };
    }
    return frequencyToDayjsPeriod[frequency];
}
//# sourceMappingURL=convert-frequency.js.map