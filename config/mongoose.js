const mongoose = require('mongoose'); // momgoose required
const env = require('dotenv').config();
const database = process.env.DB_URL
mongoose.connect(database); 
const db = mongoose.connection; //made conection to mongoose

db.on('error',console.error.bind(console, "Error connection to mongodb"));
db.once('open',function(){
    //if connected successfully
    console.log('connected to database :: MongoDB');
});

module.exports = db;