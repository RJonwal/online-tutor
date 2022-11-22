const express        = require('express');
const port           = 8000;
const env            = require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
const cookieParser   = require('cookie-parser');
const bodyParser     = require("body-parser");
const session        = require('express-session');
const passport       =  require('passport');
const passportLocal  = require('./config/passport-local-strategy');
const MongoStore     = require('connect-mongo');
const flash          = require("connect-flash");
const customMware    = require('./config/middleware');
const app            = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.use(expressLayouts);
app.use(express.static('./assets'));

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'tutorial',
    // TODO change the secret before deployment in production mode
    secret: 'tutorialscrete',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
       console.log(`Server is running on port: ${port}`);
});
