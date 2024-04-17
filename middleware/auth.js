const {jwtDecode} = require('jwt-decode');

const isLoggedInAndFarmer = function (req, res, next){
    if(!req.signedCookies.info){
        return res.send({status:401, message:'Belum melakukan login'});
    }
    let user = jwtDecode(req.signedCookies.info)
    if(!user.user.role == "Farmer"){
        return res.send({status:401, message:'Anda bukan seorang farmer'});
    }
    next();
}

const isLoggedInAndUser = function(req, res, next){
    if(!req.signedCookies.info){
        return res.send({status:401, message:'Belum melakukan login'});
    }
    let user = jwtDecode(req.signedCookies.info)
    if(!user.user.role == "User"){
        return res.send({status:401, message:'Anda bukan seorang farmer'});
    }
    next();
}

module.exports = {isLoggedInAndFarmer, isLoggedInAndUser};