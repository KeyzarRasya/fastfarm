const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true,
        default:0
    },
    quantity:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        enum:["Ready", "Empty"],
        default:"Ready"
    },
    farmer:{
        type:mongoose.Schema.ObjectId,
        ref:'Farmer'
    }
})

const Model = mongoose.model('Product', productSchema);

module.exports = Model;