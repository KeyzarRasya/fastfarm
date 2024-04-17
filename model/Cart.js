const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    product:{type:mongoose.Schema.ObjectId, ref:'Product'},
    amount:{
        type:Number,
        require:true
    }
})