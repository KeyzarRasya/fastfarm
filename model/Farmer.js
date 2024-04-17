const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const farmerSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:'Farmer'
    },
    products:[{type:mongoose.Schema.ObjectId, ref:'Product', default:[]}]
})

farmerSchema.statics.findAndValidate = async function(email, password){
    let findFarmer = await Model.findOne({email});
    console.log(findFarmer);
    if(!findFarmer){
        return false;
    }
    let isValid = await bcrypt.compare(password, findFarmer.password);
    console.log(isValid);
    return isValid ? findFarmer : false;
}

farmerSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const Model = mongoose.model('Farmer', farmerSchema);

module.exports = Model;