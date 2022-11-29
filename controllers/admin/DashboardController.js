const User  = require('../../models/user');
let session = require('express-session'); 
const bcrypt = require("bcryptjs");

module.exports.dashboard = async function(req,res){
    try {
        return res.render('../views/admin/dashboard');
    } catch{
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}

