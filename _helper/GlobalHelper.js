const bcrypt = require("bcryptjs");
module.exports = {
    baseUrl,
    securePassword,
    calculateDuration,
}
function baseUrl(req){
    const url = req.protocol+"://"+req.headers.host;
    return url;
}

function securePassword(password){
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

function calculateDuration(durationArray) {
    var totalDuration = '';
    var hour = 0;
    var minute = 0;
    var i = 0;
    var hh = [];
    var mm = [];

   for (duration of durationArray) {
        splitTime = duration.split(':');
        hh[i] = splitTime[0];
        mm[i] = splitTime[1];
        i++;
    }

    hh.forEach(item => {
        hour += Number(item);
    });

    mm.forEach(item => {
        minute += Number(item);
    });

    hour = hour + minute / 60;
    minute = minute % 60;
    // console.log('sum of above time= ' + hour + ':' + minute);
    totalDuration = Math.floor(hour)  + ':' + Math.floor(minute) +' hrs';
    return totalDuration;
}
