const Farmer = require("../model/Farmer");
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../model/Product');
const {isLoggedInAndFarmer} = require('../middleware/auth');
const getMyInfo = require('../middleware/user');

const router = express.Router();

router.post('/signup', async(req, res) => {
    const {email, password} = req.body;
    const newfarmer = new Farmer({email, password});
    newfarmer.save();
    res.send(newfarmer);
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    let findFarmer = await Farmer.findAndValidate(email, password);
    console.log(findFarmer)
    if(!findFarmer){
        return res.status(401).send("account not found");
    }
    let token = jwt.sign({user:findFarmer}, process.env.JWT_SECRET, {expiresIn:'1h'});
    res.cookie('info', token, {signed:true});
    res.send(token);
})

router.get("/logout", (req, res) => {
    res.clearCookie('info', {signed:true});
    res.status(200).send("Logout successfuly");
})

router.post("/add/product", isLoggedInAndFarmer ,async(req, res) => {
    const {name, price, quantity} = req.body;
    const newProduct = new Product({name, price, quantity});
    const farmerCookie = getMyInfo(req.signedCookies.info);
    const farmer = await Farmer.findOne({_id:farmerCookie._id});
    newProduct.farmer = farmer._id;
    farmer.products.push(newProduct._id)
    newProduct.save();
    farmer.save();
    res.send({status:200, message:"One Product Added!"});
})

router.get('/hi', (req, res, next) => {
    if(!req.signedCookies.info){
        return res.status(401).send("You have to login");
    }
    next();
},(req, res) => {
    res.send("HI")
})

module.exports = router;