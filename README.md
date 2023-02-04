# Orbofi-Backend


//Validation 

  // Validate user input
    // if (!(email && password && first_name && last_name)) {
    //     res.status(400).send("All input is required");
    //   }


////////////////////*****MongoDb connection with localhist******//////////////////////////
    const mongoose = require("mongoose");
// mongoose.connect(
//     "mongodb://localhost:27017",
//     {
//       dbName: "nightBazar",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     },
//     (err) =>
//       err ? console.log({err : err}) : console.log(
//         "Connected to demo-name database")
//   );