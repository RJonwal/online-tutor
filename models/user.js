const mongoose   = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname:{
        type     : String,
        required : true,
    },
    lastname:{
        type     : String,
        required : true,
    },
    email:{
        type     : String,
        required : true,
        unique   :true,
    }, 
    phone: {
        type: Number,
        unique: true,
        required: true,
        maxlength: 10
    },
    password:{
        type : String,
        default: '',
    },
    role:{
        type: Number,
    },
    status:{
        type: Number,
    },
    token:{
        type: String,
        default: ''
    },
},{
    timestamps : true
}); 


const User = mongoose.model('user',userSchema);
module.exports = User;