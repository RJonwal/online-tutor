const User          = require('../../models/user');
const bcrypt        = require("bcryptjs");
const mail          = require('../../config/mail');
const randomstring  = require("randomstring");
const global        = require("../../_helper/GlobalHelper");
module.exports = {
    login,
    signin,
    logout,
    forgetPassword,
    forget,
    resetPassword,
    verifyPassword 
};

async function login(req,res){
    try {
        if (req.isAuthenticated()){
            return res.redirect('/user/dashboard');
        }
        return res.render('../views/auth/login');
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
        
        return res.render('../views/auth/forget-password');
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
};

async function forget(req,res){
    try {
        let user =  await User.findOne({email: req.body.email});
        if(user){
            const randomString = randomstring.generate();
            const url = req.protocol+"://"+req.headers.host+'/reset-password?token='+randomString;
            let updated = await User.findByIdAndUpdate(user.id,{token:randomString});
            let htmlString = mail.renderTemplate({token:url},'/forget.ejs');
            let mailOptions = {
                from: 'admin@gmail.com',
                to: 'amitpandey.his@gmail.com',
                subject: 'Forgot Password',
                text: 'Hello, We got request for reset password.',
                html: htmlString,
            };
            mail.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                req.flash('success','Mail Sent! Please check your mail');
                return res.redirect('/forget-password');
            });
        }else {
            req.flash('error','Sorry! User Not Found');
            return res.redirect('/forget-password');
        }
       
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
};

async function resetPassword(req,res){
    try {
        return res.render('../views/auth/reset-password');
    } catch (error) {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
async function verifyPassword(req,res){
    try {
        //let token = req.query.token;
        console.log('amit',token);
        if(req.password != req.confirm_password){
            req.flash('error','Confirm password and password not matched');
            return res.redirect('/reset-password?token='+token);
        }
    } catch (error) {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}