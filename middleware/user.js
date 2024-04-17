const { jwtDecode } = require("jwt-decode")

const getMyInfo = function(signedCookies) {
    let user = jwtDecode(signedCookies);
    return user.user;
}

module.exports = getMyInfo;