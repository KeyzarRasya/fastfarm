const express = require("express")
const User = require("../model/User")
const Product = require('../model/Product');
const jwt = require('jsonwebtoken');
const midtransClient = require('midtrans-client');
const getMyInfo = require('../middleware/user');
const {v4:uuid} = require('uuid');
const { jwtDecode } = require("jwt-decode");
const Farmer = require('../model/Farmer')

const router = express.Router();

let snap = new midtransClient.Snap({
    isProduction:false,
    serverKey:process.env.SERVER_KEY
})

router.post("/signup", async(req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const newuser = new User({firstName, lastName, email, password});
    newuser.save();
    res.send({status:200, message:"Account created"});
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    let findUser = await User.findAndValidate(email, password);
    if(!findUser){
        return res.send({status:401, message:"You entered the wrong credentials"});
    }
    let token = jwt.sign({user:findUser}, process.env.JWT_SECRET, {expiresIn:'1h'});
    res.cookie('info', token, {signed:true});
    res.send({status:200, message:'Login successfuly'});
})

router.post("/buy/:productId", async(req, res) => {
    const {productId} = req.params;
    const {amount} = req.body;
    const userCookie = jwtDecode(req.signedCookies.info);
    console.log(userCookie.user);
    const user = await User.findById(userCookie.user._id);
    const product = await Product.findById(productId);
    if(!user && !product){
        return res.send({status:401, message:'Something wrong'});
    }
    const farmer = await Farmer.findById(product.farmer._id);
    let parameter = {
        "transaction_details":{
            "order_id":uuid(),
            "gross_amount":amount*product.price
        },
        "item_details":[{
            "id":product._id,
            "price":product.price,
            "quantity":amount,
            "name":product.name
        }],
        "credit_card":{
            "secure":true
        },
        "customer_details":{
            "first_name":user.firstName,
            "last_name":user.lastName,
            "email":user.email
        }
    }

    let transaction = await snap.createTransaction(parameter)

    res.send(transaction)

})

module.exports = router;