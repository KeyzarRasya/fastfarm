const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:"User"
    },
    password:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true,
        default:""
    },
    cart:[
        {type:mongoose.Schema.ObjectId, ref:'Cart', default:[]}
    ]
})

userSchema.statics.findAndValidate = async function(email, password) {
    let findUser = await Model.findOne({email});
    if(!findUser){
        return false;
    }
    let isPassValid = await bcrypt.compare(password, findUser.password);
    return isPassValid? findUser : false;
}

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const Model = mongoose.model('User', userSchema);

module.exports = Model;