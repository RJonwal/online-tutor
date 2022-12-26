var moment = require('moment');
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success' : req.flash('success'),
        'error'   : req.flash('error')
    }
    next();
};
module.exports.dateFormate = function(req, res, next){
    res.locals.moment = moment;
    next();
}
module.exports.loggedInUserDetails = function(req, res, next){
        global.user_detail = res.locals.user;
        next();
}
module.exports.permission = function(req, res, next){
    
    next();
}