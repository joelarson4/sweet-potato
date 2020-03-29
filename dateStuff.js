var months = require('months');

function getDateOfISOWeek(y, w, d) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    ISOweekStart.setHours(19);
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1 + d);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay() + d);
    return ISOweekStart;
}

function getWeekNumber(d) {
    if(!d) { d = new Date(); }
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

function getMonthName(d) {
    return months[d.getMonth()];
}

function getDateFromISO(iso) {
    var date = new Date(iso.substring(0,4), Number(iso.substring(5,7)) - 1, Number(iso.substring(8,10)));
    return date;
}

function zeroPad(number, length) {
    return '000000000'.substring(0, length - number.length) + number;
}

function getUsFormat(d) {
    return zeroPad(1 + d.getMonth(),2) + '/' + zeroPad(d.getDate(),2) + '/' + d.getFullYear();
}

function fromUsFormat(str) {
    var strspl = str.split('/');
    return new Date(Number(strspl[2]), Number(strspl[0]) - 1, Number(strspl[1]));
}

function getNowIsoPst() {
    var date = new Date();
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate());
}



module.exports = {
    now: new Date(),
    getDateOfISOWeek: getDateOfISOWeek,
    getWeekNumber: getWeekNumber,
    getDateFromISO: getDateFromISO,
    getMonthName: getMonthName,
    getUsFormat: getUsFormat,
    fromUsFormat: fromUsFormat,
    getNowIsoPst: getNowIsoPst
}