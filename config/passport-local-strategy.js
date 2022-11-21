const passport = require('passport'); // require passport
const LocalStrategy = require('passport-local').Strategy; // require the strategy
const User = require('../models/user'); // require user

// tell passport to use the local strategy for authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
    }, function (email, password, done) {
        User.findOne({email: email}, function(err, user)  {
            if (err){
                req.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password){
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//serialise the user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) { console.log("Error in finding user -->Passport"); return done(err); }
        return done(null, user);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
    //if the user is signed in then pass on request to next function which is controller's action)
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not signedin 
    return res.redirect('/');
}

//set the authenticated user
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //contains the current signed in user from the session cookie. We are sending this to locals for the views 
        res.locals.user = req.user;
        // console.log(res.locals.user);
    }
    next();
}

module.exports = passport;