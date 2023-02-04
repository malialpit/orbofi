const loginTokenModel = require('../../models/logintoken');
const validator  = require('../../validations/validator');
const likeUnlikePostModel = require('../../models/likeUnlikePost');

const likeUnlikePost = async(request , response) => {
    try{
        const
        {
            user_id,
            post_id
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
        if (!validator.isValid(user_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid user id" });
        }

        if (!validator.isValid(post_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid post id" });
        }

        let token = request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token });
        if (!isLogin) {
            return response.status(200).send({
                message: "Invalid Token",
            });
        }

        // const findData = await likeUnlikePostModel.findOne({user_id  :user_id,post_id  :post_id ,is_deleted : false })
        const findData = await likeUnlikePostModel.findOne({user_id  :user_id,post_id  :post_id    })

        if(findData === null){
           const saveData = { 
            user_id  :user_id,
            post_id  :post_id
        }
         const likePost = await likeUnlikePostModel.create(saveData);
        if(likePost){
            return response.status(200).send({status : true , message : "Post like succesfully" , data :likePost })
       }
        }else{
            const is_deleted = {};
            if(findData.is_deleted === true)
            {  
                is_deleted["is_deleted"] = false
            }
            else
            {
                is_deleted["is_deleted"] = true
            }
                    const unlikePost  = await likeUnlikePostModel.findOneAndUpdate({ _id :findData._id } , is_deleted);
                    if(unlikePost){
                         return response.status(200).send({status : true , message : (unlikePost.is_deleted=== false ? "Post unlike succesfully" :"Post like succesfully") , data :unlikePost }) 
                    }
        }  
    }catch(error) 
    {
        console.log({error:error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

module.exports = { likeUnlikePost}