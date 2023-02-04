const express = require('express');
const router = express();
const userAuth = require('../middleware/auth');

const intrestController = require('../controller/admin/intrestController');
router.post('/create-intrest',userAuth.userAuth,intrestController.createIntrest);

//Upload Excel Sheet START
  var path = require("path");
  const multer = require("multer");
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) 
    }
  })
var upload = multer({ storage: storage });
router.post('/intrest-upload',upload.single('file'),userAuth.userAuth,intrestController.uploadIntrest);

//Add Country
const countryController = require('../controller/admin/countryController')
router.post('/add-country',upload.single('file'),userAuth.userAuth,countryController.createCountry);

module.exports = router;