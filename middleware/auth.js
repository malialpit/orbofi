const jwt = require("jsonwebtoken");
const logintoken = require("../models/logintoken");
const userAuth = async (req, res, next) => {
  try {
   let token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(200)
        .send({
          status: false,
          message: `Missing authentication token in request`,
        });
    }

    const isLogin = await logintoken.findOne({ token: token });
    console.log({isLogin  :isLogin})
   
     //let  userId = isLogin.userId;



    if (!isLogin) {
      return res.status(200).send({ status: false, message: "invalid token" });
    }

    next();
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  userAuth
};
