var express = require('express');

var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
const session = require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;
const passport = require('passport')
const dotenv = require('dotenv')
dotenv.config()

// const Twitter = require('twitter');
var app = express();
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));

//app.use("/public", express.static(path.join(__dirname, "public")));
//For Image Uploading
app.use(cors());
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));

app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
})

// Twitter Login

const userModel  = require('./models/users');
const jwt = require("jsonwebtoken");
const key  =   process.env.TOKEN_KEY;
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:3300/auth/twitter/callback"
},
function(accessToken, refreshToken, profile, cb) {
  
  //console.log({data : profile, cb });
    // const saveData = {
    //   name : 
    // }
   
  const jwtToken = '';
  // cb(null, profile, jwtToken);
  cb(null, profile , accessToken, refreshToken);
}
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  async function(req, res) {
    console.log({ user: req.user})
    const saveData = {
            name : req.user.username,
            social_id : req.user.id,
            social_type : "twitter",
            profile_picture  : req.user._json.profile_image_url_https,
            user_type : "user",
            twitter: 1,
    }

    const createUser = await userModel.create(saveData);
    console.log({ createUser })

     //Token Generate
     const token = jwt.sign(
      {...createUser,
          expiresIn: '365d',  //setting token expiry time limit.
      },
      key
  )

    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/verifyAuth?authToken=" + token);
  });

// Twitter login end 


//Route Connection
app.use("/user",require('./routes/customerRoutes'));
app.use("/admin",require('./routes/adminRoutes'));

//Database connection with mongodb 
const mongoose = require("mongoose");

//Mongodb Live URL
const url = `mongodb+srv://orbofi-project:iQVmkiPek3c5T0cg@orbofi.mnmnrdo.mongodb.net/orbofi`
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


    const LoginWithTwitter = require('login-with-twitter');
const { response } = require('./routes/customerRoutes');
 
const tw = new LoginWithTwitter({
  consumerKey: '67W6TEBEFkR0pffgmKYb8ejzU',
  consumerSecret: 'ucRy4NH67Cnr4nlAg3WzJ90XLsDdE8CbK8DuBwQuRx0YycI2uo',
  callbackUrl: 'https://truthful-goldfish.surge.sh/'
})


//   //Running Server Port
//   app.listen(3300, function () {
//     console.log('Listening to Port 3300');
//   });

app.get('/twitter', (request, response) => {
  tw.login((err, tokenSecret, url) => {

    if(err)
    {
      return response.status(500).send({ statusCode : 500 ,  message : err.message , data : null})
    }

    return response.status(200).send({ statusCode : 200 ,  message : "Twitter Login Succesfully" , data : url})
    
    //console.log({ url  :url})
    //console.log({ tokenSecret  :tokenSecret})
    // Save the OAuth token secret for use in your /twitter/callback route
    //request.session.tokenSecret = tokenSecret
    
    // Redirect to the /twitter/callback route, with the OAuth responses as query params
 //   response.redirect(url)
  })
})

// app.get('/twitter/callback', (req, res) => {

//   //console.log({req  :req.query.oauth_token })
//   tw.callback({
//     oauth_token: req.query.oauth_token,
//     oauth_verifier: req.query.oauth_verifier
//   }, req.session.tokenSecret, (err, user) => {

//   //  console.log({ })

//     console.log({ tokenSecret : req.session.tokenSecret})
//     if (err) {
//       // Handle the error your way
//     }
    
//     // Delete the tokenSecret securely
//     delete req.session.tokenSecret
    
//     // The user object contains 4 key/value pairs, which
//     // you should store and use as you need, e.g. with your
//     // own calls to Twitter's API, or a Twitter API module
//     // like `twitter` or `twit`.
//     // user = {
//     //   userId,
//     //   userName,
//     //   userToken,
//     //   userTokenSecret
//     // }
//     req.session.user = user
    
//     // Redirect to whatever route that can handle your new Twitter login user details!
//     res.redirect('/')
//   });
// });

app.listen(3300, function() {
  console.log(`Listening on port 3300`);
});