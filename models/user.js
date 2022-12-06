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
    gender:{
        type: Number,
    },
    token:{
        type: String,
        default: ''
    },
    profile_image:{
        type: String,
        default:''
    },
    //extra field for student student start
    start_date:{
        type: Date,
        default: ''
    },
    skill_level:{
        type: String,
        default: ''
    },
    birth_day:{
        type: Date,
        default: ''
    },
    referrer:{
        type: String,
        default: ''
    },
    note:{
        type: String,
        default: ''
    },
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schools',
        default: ''
    },
    // end student
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}); 


const User = mongoose.model('user',userSchema);
module.exports = User;