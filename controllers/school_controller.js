const School  = require('../models/school');
let session = require('express-session'); 

module.exports = {
    addSchool,
    createSchool
}
async function addSchool(req,res){
    try {
        let school= await School.find({}).sort({ '_id' : -1 } );
        return res.render('../views/school/index',{data:school});
    } catch{
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}
async function createSchool(req,res){
    try {
        console.log(req.body);
        let schoolAdded = await School.create(req.body);
        if(schoolAdded){
            req.flash('success','School Created Successfully !');
        }
        return res.redirect('/school');
    } catch{
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}
