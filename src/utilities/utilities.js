

function getWeekNumber(date) {
    // Copy date so don't modify original
    date = new Date(date);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNumber = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
    // Return week number
    return weekNumber;
}

export default getWeekNumber;