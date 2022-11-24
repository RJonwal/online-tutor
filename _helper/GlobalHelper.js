const bcrypt = require("bcryptjs");
module.exports = {
    baseUrl,
    securePassword
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
   
