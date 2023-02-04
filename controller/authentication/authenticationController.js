const userModel  = require('../../models/users');
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const key  =   process.env.TOKEN_KEY;
const loginTokenModel = require('../../models/logintoken');
const validator  = require('../../validations/validator');
const bcrypt = require("bcrypt");
var dateTime = new Date();
//Image Uploading
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "google-cloud-key.json" });


//User Registration
// const register = async(request , response ) => {
//     try{

//         const
//         {
          
//            email,
//            password,
//            user_type,
//         } = request.body;

//         if (!validator.isValidRequestBody(request.body)) {
//             return response
//               .status(200)
//               .send({ status: false, message: "please provide valid request body" });
//           }
        
//         const isEmailAleadyUsed = await userModel.findOne({ email });
//         if (isEmailAleadyUsed) {
//             return response.status(200).send({
//                 status: false,
//                 message: `${email} is already in use. Please try another email Id.`,
//             });
//         }

//     //     if(!emailvalidator.validate(email)){
//     //         return response
//     //         .status(200)
//     //         .send({ status: false, message: "You email is not valid" });
//     //   }

//         //validating email using RegEx.
//         if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
//         {
//             return response
//             .status(200)
//             .send({ status: false, message: "Invalid Email id." });
//         }
        
//         if (!validator.isValid(password)) {
//             return response
//                 .status(200)
//                 .send({ status: false, message: "please provide valid password" });
//         }

//         if (password.length < 6 || password.length > 15) {
//             return response
//                 .status(200)
//                 .send({ status: false, message: "Password must be of 6-15 letters." });
//         }

//         if (!validator.isValid(user_type)) {
//             return response
//                 .status(200)
//                 .send({ status: false, message: "please  provide valid user type" });
//         }

//         //encrypting password
//         const saltRounds = 10;
//         const encryptedPassword = await bcrypt.hash(password, saltRounds);
       
//         const saveData = {
//             email : email,
//             password  : encryptedPassword,
//             user_type : user_type,
//         }

//         const createUser = await userModel.create(saveData);
//         if(createUser)
//         {
//             return response.status(200).send({status : true , message : "Your Registration Account Successfully" , data : createUser})
//         }
//         else
//         {
//             return response.status(200).send({status : false , message : "Your Registration Account Creating Error" , data : null})
//         }
//     }catch(error)
//     {
//         console.log({ error : error})
//         return response.status(500).send({status : false , message :error.message , data : null})
//     }
// }


const register = async(request , response ) => {
    try{

        const
        {
          name,
           email,
           country,
           intrest_id,
           profile_picture,
           social_id,
           social_type,
           user_type,
        } = request.body;

        if (!request.file) {
            return response
            .status(500)
            .send({ status: false, message: "please provide valid profile picture" , data : null});
        }

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
        
        const isEmailAleadyUsed = await userModel.findOne({ email });
        if (isEmailAleadyUsed) {
            return response.status(200).send({
                status: false,
                message: `${email} is already in use. Please try another email Id.`,
            });
        }

        //validating email using RegEx.
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            return response
            .status(200)
            .send({ status: false, message: "Invalid Email id." });
        }

        if (!validator.isValid(social_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please  provide valid social id" });
        }

        if (!validator.isValid(social_type)) {
            return response
                .status(200)
                .send({ status: false, message: "please  provide valid social type" });
        }
        

        if (!validator.isValid(user_type)) {
            return response
                .status(200)
                .send({ status: false, message: "please  provide valid user type" });
        }

       
       
        const saveData = {
            name : name,
            email : email,
            country  :country,
            intrest_id  :intrest_id,
            social_id : social_id,
            social_type : social_type,
            profile_picture  : blob.name,
            user_type : user_type,
            token : token,
        }

        const createUser = await userModel.create(saveData);
        const token = jwt.sign(
            {...createUser,
                expiresIn: '365d',  //setting token expiry time limit.
            },
            key
        )
        if(createUser)
        {
            return response.status(200).send({status : true , message : "Your Registration Account Successfully" , data : {...createUser, authToken: token}})
        }
        else
        {
            return response.status(200).send({status : false , message : "Your Registration Account Creating Error" , data : null})
        }
    }catch(error)
    {
        console.log({ error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}


//User Login
const login = async(request , response) =>{
    try{
        const{
              email,
              password,
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }

        if (!validator.isValid(email)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid email" });
        }

        if (!validator.isValid(password)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid password" });
        }

        //Email Validaton
        const findUser = await userModel.findOne({email : email})
        if(!findUser)
        {
              return response.status(200).send({status : false , message : "Email Is Not Exist",data:null})
        }


        //Password Validation
        let hashedPassword = findUser.password;
        const encryptedPassword = await bcrypt.compare(password, hashedPassword); //converting normal password to hashed value to match it with DB's entry by using compare function.

        if(!encryptedPassword)
            return response
                .status(200)
                .send({
                    status: false,
                    message: `Login failed! password is incorrect.`,
                });

               
        //Token Generate
        const token = jwt.sign(
            {
                userId: findUser._id,
                //expiresIn: '365d'  //setting token expiry time limit.
            },
            key
        )

        //Add Login Token Data
        const saveData = {
            userId : findUser._id,
            token : token,
            user_type : findUser.user_type,
            last_login : dateTime,
        }

        const createLoginToken = await loginTokenModel.create(saveData);
        if(createLoginToken)
        {
            const data = {
                name : findUser.name,
                mobile_no : findUser.mobile_no,
                user_type : findUser.user_type,
                token : createLoginToken.token,
                last_login : createLoginToken.last_login
            }
            return response.status(200).send({status : true , message :"Login Successfully", data : data})
        }
        else
        {
            return response.status(200).send({status : false , message :"Login Error", data : null})
        }
       

    }catch(error)
    {
        console.log({ error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

//Update Profile
const updateProfile = async(request , response) => {

    try{
       
        const
        { 
            id,
            name,
            intrest,
            country,
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }

        if (!validator.isValid(id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid id" });
        }

        if (!validator.isValid(intrest)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid intrest" });
        }

        if (!validator.isValid(country)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid country" });
        }

        if (country.length > 3) {
            return response
                .status(200)
                .send({ status: false, message: "Country can not add more than 3." });
        }

        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

        const updateData = {
            name   :name,
            intrest_id  :intrest,
            country  :country,
        }

        const updateUser = await userModel.findOneAndUpdate({ _id : id}, updateData);
        if(updateUser)
        {
            return response
            .status(200)
            .send({ status: true, message: "Profile Updated succesfully." , data : updateUser});
        
        }
        else
        {
            return response
            .status(200)
            .send({ status: false, message: "Profile upating error" , data : null});
        }

    }catch(error)
    {
        console.log({error : error})
      return response.status(500).send({status : false , message :error.message , data : null})
    }
}

//Change Password
const changePassword = async(request , response) => {
    try{
        const
        {
            email, 
            old_password,
            new_password
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }

    
        if (!validator.isValid(email)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid email" });
        }

        if (!validator.isValid(old_password)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid old password" });
        }

        if (!validator.isValid(new_password)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid new password" });
        }

        if (new_password.length < 6 || new_password.length > 15) {
            return res
                .status(200)
                .send({ status: false, message: "Password must be of 6-15 letters." });
        }

        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

          //Password Validation
          const checkEmailAndPassword = await userModel.findOne({ email : email})
          const isValidPassword = await bcrypt.compare(old_password ,checkEmailAndPassword.password);
          if (!isValidPassword) {
              return response.status(200).send({status : true,message : 'Please enter correct old password' , data : null});
          }

         //encrypting password
         const saltRounds = 10;
         const encryptedPassword = await bcrypt.hash(new_password, saltRounds);

        const updateData  = {
            password  : encryptedPassword
        }

        const updatePassword = await userModel.findOneAndUpdate({ _id : checkEmailAndPassword._id},updateData)
        if(updatePassword){
            return response.status(200).send({status : true , message :"Password Updated Successfully", data : updatePassword})
        }else{
            return response.status(200).send({status : false , message :"Password Updating Error", data : null})
        }
    }catch(error)
    {
        console.log({error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

//Social Account Link API
const linkSocialAccount = async(request , response) => {
    try{
       
        const{
            user_id,
            social_account
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }

          if (!validator.isValid(social_account)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid social account" });
        }


        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

     
      let statusChange;
      
        if(social_account === "facebook"){
             statusChange = await  userModel.findOneAndUpdate({_id  :user_id} , { "facebook" : 1   })
        }

        if(social_account === "gmail"){
            statusChange = await  userModel.findOneAndUpdate({_id  :user_id} , { "gmail" : 1   })
        }

        if(social_account === "twitter"){
            statusChange = await  userModel.findOneAndUpdate({_id  :user_id} , { "twitter" : 1   })
        }

        if(social_account === "discord"){
            statusChange = await  userModel.findOneAndUpdate({_id  :user_id} , { "discord" : 1   })
        }
        if(statusChange){
            return response.status(200).send({status : true , message :`${social_account} Is Linked Succesfully`})
        }else{
            return response.status(200).send({status : false , message :"Something Went Wrong" , data : null})
        }

    }catch(error){
        console.log({error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}



//Login With Twitter
const loginWithTwitter = async(request , response) => {
     try{
         
     }catch(error){
        console.log({error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
     }
}

module.exports = {
    register,login,updateProfile,changePassword,linkSocialAccount,loginWithTwitter
}