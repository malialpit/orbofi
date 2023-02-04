const express = require('express');
const router = express();
const userAuth = require('../middleware/auth');

//For Image UPLoading
const Multer = require('multer');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
  });

  
//Login & Register Router
const authenticationController = require('../controller/authentication/authenticationController');
router.post('/register',multer.single('profile_picture'),authenticationController.register)
router.post('/login',authenticationController.login)
router.put('/update-profile',userAuth.userAuth,authenticationController.updateProfile);
router.put('/change-password',userAuth.userAuth,authenticationController.changePassword);
router.post('/link-social-account',userAuth.userAuth,authenticationController.linkSocialAccount);
router.post('/login-with-twitter',userAuth.userAuth,authenticationController.loginWithTwitter);


//Create & Update Intrest
const intrestController = require('../controller/admin/intrestController');
router.post('/create-intrest',userAuth.userAuth,intrestController.createIntrest);
router.post('/search-intrest',userAuth.userAuth,intrestController.searchIntrest)

//Upload Post ,Vidieo Upload
const postController = require('../controller/customer/postController');
router.post('/upload-post',multer.single('file'),userAuth.userAuth,postController.uploadPost);
router.post('/get-post',userAuth.userAuth,postController.getPost);
router.put('/delete-post',userAuth.userAuth,postController.deletePost);

//Create Comment
const commentController = require('../controller/customer/commentController');
router.post('/add-comment',userAuth.userAuth,commentController.addComment);
router.post('/get-comment',userAuth.userAuth,commentController.getComment);
router.post('/delete-comment',userAuth.userAuth,commentController.deleteComment);

//Comment Replay
router.post('/add-comment-replay',userAuth.userAuth,commentController.addCommentReplay);

//Post like unlike 
const likeUnlikePostController = require('../controller/customer/likeUnlikePostController');
router.post('/like-unlike-post',userAuth.userAuth,likeUnlikePostController.likeUnlikePost);

module.exports = router;