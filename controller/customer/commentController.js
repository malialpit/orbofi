const loginTokenModel = require('../../models/logintoken');
const validator  = require('../../validations/validator');
const commentModel = require('../../models/comment');
var ObjectId = require('mongoose').Types.ObjectId;
const commentsReplayModel = require('../../models/commentsReplay');


//Create Comment
const addComment = async(request , response) => {
    try{

        const{
            user_id,
            post_id,
            comment,
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
         if (!validator.isValid(user_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid user name" });
        }

        if (!validator.isValid(post_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid post id" });
        }

        if (!validator.isValid(comment)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid comment" });
        }

        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token : token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

        const addData = {
            user_id  :user_id,
            post_id : post_id,
            comment :comment,
        }

        const addComment  = await  commentModel.create(addData)
        if(addComment){
            return response.status(200).send({status : true , message :"Comment add successfully.", data : addComment})
        }else{
            return response.status(200).send({status : false , message :"Comment creating error", data : null})
        }

    }catch(error)
    {
        console.log({error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

//Get Comment
const getComment  =async(request , response) => {
    try{

        const{
            post_id
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
    
        if (!validator.isValid(post_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid post id" });
        }

        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

       // const getComment = await commentModel.find({ post_id : post_id ,is_deleted:false});
        const getComment = await commentModel.aggregate([
             {$match : { post_id : ObjectId(post_id) , is_deleted:false }},
             {
                $lookup : {
                    from:"users",
                    localField:"user_id",
                    foreignField:"_id",
                    as:"userData" 
                }
             },
             {
                $lookup : {
                    from:"comments_replays",
                    localField:"_id",
                    foreignField:"comment_id",
                    as:"CommentReplay" 
                }
             },
             { 
                "$project": { 
                "comment" : 1,
                "userData.name" : 1,
                "CommentReplay.replay"  :1
             } }

        ])
        if(getComment){
            return response.status(200).send({status : true , message :"Comment get successfully", data : getComment})
        }else{
            return response.status(200).send({status : false , message :"No Comment", data : null})
        }
    }catch(error){
        console.log({error : error})
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

//Delete Comment
const deleteComment = async(request , response) => {
    try{
        const{
            id //Comment ID
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
         if (!validator.isValid(id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid comment id" });
        }

        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

        const updateData = {
            is_deleted : true
        }

        const deleteComment = await commentModel.findOneAndUpdate({ _id  :id} ,updateData )
        if(deleteComment)
        {
           return response.status(200).send({status : true , message :"Comment deleting successfully", data : deleteComment})
        }
        else{
            return response.status(200).send({status : false , message :"Comment deleting error", data : null})
        }
    }catch(error){
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

//Add Comment Replay
const addCommentReplay = async(request , response) => {
     try{

        const{
            user_id,
            comment_id,
            replay
        } = request.body;

        
        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
         if (!validator.isValid(comment_id)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid comment id" });
        }

        if (!validator.isValid(replay)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid replay" });
        }

        const saveData = {
            user_id : user_id,
            comment_id : comment_id,
            replay : replay
        }

        let token= request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token })
        if (!isLogin) {
            return response.status(200).send({ status: false, message: "invalid token" })
        }

        const createCommentReplay = await commentsReplayModel.create(saveData);
        if(createCommentReplay)
        {
           return response.status(200).send({status : true , message :"Replay added successfully", data : createCommentReplay})
        }
        else{
            return response.status(200).send({status : false , message :"Replay creating error", data : null})
        }

     }catch(error){
        return response.status(500).send({status : false , message :error.message , data : null})
     }
}

module.exports = { addComment , getComment , deleteComment , addCommentReplay}