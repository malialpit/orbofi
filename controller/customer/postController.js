
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const validator  = require('../../validations/validator');
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("orb-user-content1");
const postModel = require('../../models/post');
const loginTokenModel = require('../../models/logintoken');

//Upload Post
const uploadPost = async(request  , response) => {
    try{
        const
        {
            user_id,
            text,
        } = request.body;

    if (!request.file) {
        return response
        .status(500)
        .send({ status: false, message: "please provide valid image/Vidieo/Audio/GIF/Text" , data : null});
    }

   // const blob = bucket.file(request.file.originalname); 
    const fileExtension = request.file.originalname.split('.')[1];
    const blob = bucket.file(Date.now() + '.' + fileExtension);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (error) => {
        return response
        .status(500)
        .send({ status: false, message: error.message , data : null});
    });

    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      const saveData = {
        user_id : user_id,
        file : blob.name,
        text : text
      }
     
      const addPost = await postModel.create(saveData)
      if(addPost){
        response.status(200).send({status: true,
            message: "Uploaded file successfully" , data :{ publicUrl :publicUrl ,addPost},
          });
      }else{
        response.status(200).send({status: false,
            message: "File Uploading Error" , data : null,
          });
      }

    
      });
     blobStream.end(request.file.buffer);
    }
    catch(error)
    {
        console.log({error  :error })
        return response
        .status(500)
        .send({ status: false, message: error.message, data : null});
    }
}

//Delete Post
const deletePost = async(request , response) => {
  try{

    const
    {
      id
    } = request.body;

    const deleteFile = await postModel.findOne({_id : id });
    if(!deleteFile)
    {
      return response.status(200).send({status: false,
        message: "Post is Not Exist" , data :null,
      });
    }

    if (!validator.isValidRequestBody(request.body)) {
      return response
        .status(200)
        .send({ status: false, message: "please provide valid request body" });
    }

  if (!validator.isValid(id)) {
      return response
          .status(200)
          .send({ status: false, message: "please provide valid  id" });
  }

     let token = request.headers["x-access-token"];
        const isLogin = await loginTokenModel.findOne({ token: token });
        if (!isLogin) {
            return response.status(200).send({
                message: "Invalid Token",
            });
        }
        const deleteData = {
            is_deleted : true
        }
    const deletePost = await postModel.findOneAndUpdate({ _id : id} , deleteData);
    if(deletePost){
       await storage.bucket(bucket.name).file(deleteFile.file ).delete();
       response.status(200).send({status: true,
        message: "delete file successfully" , data :deletePost,
      });
    }else{
      response.status(200).send({status: false,
        message: "file deleting error" , data : null,
      });
    }

  }catch(error){
    response.status(200).send({status: false,
      message: error.message , data : null,
    });
  }
}

//Get Post
const getPost = async(request , response) => {
  try{

    let token = request.headers["x-access-token"];
    const isLogin = await loginTokenModel.findOne({ token: token });
    if (!isLogin) {
        return response.status(200).send({
            message: "Invalid Token",
        });
    }

  //   const [files] = await bucket.getFiles();
  //   const getPosts = await postModel.find();
  //   console.log({getPosts  :getPosts })
  //   let fileInfos = [];
   

  //   files.forEach((file) => {
  //     fileInfos.push({
  //       name: file.name,
  //       url: file.metadata.mediaLink,
  //     });
  //   });

  //  const data = {
  //   fileInfos,
  //   getPosts

  //  }
  //   response.status(200).send(data);

    const getPosts = await postModel.find();
    if(getPosts){
      response.status(200).send({status: true,
        message: "Post get succesfully" , data :getPosts,
      });
    }else{
      response.status(200).send({status: false,
        message: "Posting error" , data : null,
      });
    }
  }catch(error){
    console.log({error : error})
    response.status(200).send({status: false,
      message: error.message , data : null,
    });
  }
}

module.exports = {uploadPost,deletePost,getPost}