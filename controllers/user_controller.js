const User  = require('../models/user');
const bcrypt = require("bcryptjs");

module.exports.login = async function(req,res){
    try {
        if (req.isAuthenticated()){
            return res.redirect('/dashboard');
        }
        return res.render('../views/user/login');
    } catch{
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}
module.exports.signin = async function(req,res){
    try{
        //let obj = { firstname: 'Super', lastname: 'Admin', email: 'superadmin@gmail.com',phone:9908765442, password: '12345',role:1,status:1 };
        //let userAdded = await User.create(obj);
        return res.redirect('/dashboard');
    } catch {
        //catching errors
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
module.exports.dashboard = async function(req,res){
    try {
        return res.render('../views/user/dashboard');
    } catch{
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}

// destroy session/cookies
module.exports.logout = function(req,res){
    req.logout(function(err){
        if (err) { return next(err); }
        res.redirect('/');
    });
};