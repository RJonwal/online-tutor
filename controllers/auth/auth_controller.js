const User          = require('../../models/user');
const bcrypt        = require("bcryptjs");
const mail          = require('../../config/mail');
const globalHelper  = require("../../_helper/GlobalHelper");
module.exports = {
    login,
    signin,
    logout,
    forgetPassword,
    forget 
};

async function login(req,res){
    try {
        if (req.isAuthenticated()){
            return res.redirect('/user/dashboard');
        }
        return res.render('../views/user/login');
    } catch{
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}
async function signin (req,res){
    try{
        //let obj = { firstname: 'Super', lastname: 'Admin', email: 'superadmin@gmail.com',phone:9908765442, password: '12345',role:1,status:1 };
        //let userAdded = await User.create(obj);
        req.flash('success','User Login Successfully !');
        return res.redirect('/user/dashboard');
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

// destroy session/cookies
function logout (req,res){
    req.logout(function(err){
        if (err) { return next(err); }
        res.redirect('/');
    });
};

function forgetPassword(req,res){
    try {
        return res.render('../views/user/forget-password');
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
};

function forget(req,res){
    try {
        // const randomPassword = globalHelper.randomPassword();
        let htmlString = mail.renderTemplate('/forget.ejs');
        let mailOptions = {
            from: 'admin@gmail.com',
            to: 'amitpandey.his@gmail.com',
            subject: 'Forgot Password',
            text: 'Hello, We got request for reset password.',
            html: htmlString,
        };
        mail.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('success');
        });
        return res.render('../views/user/forget-password');
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
};