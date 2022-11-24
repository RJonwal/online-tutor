const mongoose   = require('mongoose');
const schoolSchema = new mongoose.Schema({
    name:{
        type     : String,
        required : true,
    },
    address:{
        type    : String,
        default : ''
    },
    phone:{
        type     : Number,
        unique   :true,
        default  : ''
    },
    email:{
        type     : String,
        unique   :true,
        default  : ''
    },
    status:{
        type     : Number,
        default  : ''
    },
},{
    timestamps : true
}); 
const School = mongoose.model('school',schoolSchema);
module.exports = School;