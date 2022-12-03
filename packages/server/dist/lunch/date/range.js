"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysFromRange = void 0;
function DaysFromRange(startDate, endDate) {
    const days = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        days.push(currentDate);
        currentDate = currentDate.plus({ days: 1 });
    }
    return days;
}
exports.DaysFromRange = DaysFromRange;
