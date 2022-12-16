const User = require('../../models/user');
const mail = require('../../config/mail');
const randomstring = require("randomstring");
const global = require("../../_helper/GlobalHelper");
const fs = require('fs');

module.exports = {
    login,
    signIn,
    logout,
    forgetPassword,
    forget,
    resetPassword,
    verifyPassword,
    profile,
    updateProfile
};

async function login(req, res) {
    try {
        // create a super admin user.
        //let password = '12345'
        //let hashedPassword = global.securePassword(password);
        //let obj = { first_name: 'Super', last_name: 'Admin', email: 'superadmin@gmail.com', password: hashedPassword, role: 1, status: 1 };


        //let userAdded = await User.create(obj);
        if (req.isAuthenticated()) {
            return res.redirect('/learning-content');
        }
        return res.render('../views/auth/login', { layout: false });
    } catch {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

async function signIn(req, res) {
    try {
        req.flash('success', 'User Login Successfully !');
        return res.redirect('/learning-content');
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

function forgetPassword(req, res) {
    try {
        return res.render('../views/auth/forget-password', { layout: false });
    } catch {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
};

async function forget(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            const randomString = randomstring.generate();
            const url = global.baseUrl(req) + '/reset-password?token=' + randomString;
            let updated = await User.findByIdAndUpdate(user.id, { token: randomString });
            let htmlString = mail.renderTemplate({ token: url }, '/forget.ejs');
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
                req.flash('success', 'Mail Sent! Please check your mail');
                res.status(200).json({ "success": true, "message": "Password Changed Successfully!", "redirectUrl": "/forget-password" });
            });
        } else {
            req.flash('error', 'Sorry! User Not Found');
            return res.redirect('/forget-password');
        }

    } catch {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
};

async function resetPassword(req, res) {
    try {
        let token = req.query.token;
        return res.render('../views/auth/reset-password', { token: token, layout: false });
    } catch (error) {
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
async function verifyPassword(req, res) {
    try {

        let result = req.body.token.trim();
        //let hash = req.body.password;
        let hash = global.securePassword(req.body.password);
        console.log(hash);
        if (req.body.password != req.body.confirm_password) {
            return res.status(500).json({
                message: 'Something went wrong, please try again later.'
            })
        }
        let tokenData = await User.findOne({ token: result });
        if (tokenData) {
            let updated = await User.findByIdAndUpdate(tokenData.id, { password: hash, token: '' });
        }
        req.flash('success', 'Password Changed Successfully');
        res.status(200).json({ "success": true, "message": "Password Changed Successfully!", "redirectUrl": "/" });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong, please try again later.'
        })
    }
}
async function profile(req, res) {
    let user = await res.locals.user;
    return res.render('../views/auth/profile', { data: user, fs: fs });
};
async function updateProfile(req, res) {
    if (req.body.user_id && req.body.user_id != '') {
        let User_details = await User.find({ "_id": req.body.user_id });
        if (User_details) {
            delete req.body.email;
            if (req.file != undefined) {
                userData = User_details[0];
                let profileImage = userData.profile_image;
                const filePath = './assets/profileImage/' + profileImage;
                req.body.profile_image = req.file.filename;
                if (profileImage != '') {
                    fs.exists(filePath, function (exists) {
                        if (exists) {
                            fs.unlinkSync(filePath);
                        } else {
                            // console.log('File not found, so not deleting.');
                        }
                    });
                }
                req.body.profile_image = req.file.filename;
            } else {
                delete req.body.profile_image;
            }
            if (req.body.password) {
                let hashedPassword = global.securePassword(req.body.password);
                req.body.password = hashedPassword;
                let UpdateUser = await User.findByIdAndUpdate(req.body.user_id, req.body);
            } else {
                delete req.body.password; // delete password from body if dont want update
                let UpdateUser = await User.findByIdAndUpdate(req.body.user_id, req.body)
            }
            req.flash('success', 'Profile is updated successfully!');
            res.status(200).json({ "success": true, "message": "Profile is updated successfully!", "redirectUrl": "/profile" });
        }
    }
};
function logout(req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
};
