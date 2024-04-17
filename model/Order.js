const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    farmer:{
        type:mongoose.Schema.ObjectId,
        ref:"Farmer"
    },
    productName:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    isFinish:{
        type:Boolean,
        require:true,
        default:false
    }
})

const Model = mongoose.model('Order', orderSchema);

module.exports = Model;