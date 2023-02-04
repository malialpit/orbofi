const intrestModel = require("../../models/intrest");
const loginTokenModel = require("../../models/logintoken");
const validator = require("../../validations/validator");
const userModel = require("../../models/users");
var excelToJson = require("convert-excel-to-json");

//Create Intrest
const createIntrest = async(request , response) =>{
    try{
        const
        {
            intrest_name
        } = request.body;

    if (!validator.isValidRequestBody(request.body)) {
      return response
        .status(200)
        .send({ status: false, message: "please provide valid request body" });
    }
    if (!validator.isValid(intrest_name)) {
      return response
        .status(200)
        .send({ status: false, message: "please provide valid intrest name" });
    }

    let token = request.headers["x-access-token"];
    const isLogin = await loginTokenModel.findOne({ token: token });
    if (!isLogin) {
      return response
        .status(200)
        .send({ status: false, message: "invalid token" });
    }

    const findIntrest = await intrestModel.findOne({
      intrest_name: intrest_name,
    });
    if (!findIntrest) {
      const intrestData = {
        intrest_name: intrest_name,
      };

      const addIntrest = await intrestModel.create(intrestData);
      if (addIntrest) {
        const updateData = {
          $push: {
            intrest_id: addIntrest._id,
          },
        };
        const updateIntrest = await userModel.findOneAndUpdate(
          { _id: isLogin.userId },
          updateData
        );
        return response
          .status(200)
          .send({
            status: true,
            message: "Intrest add successfully",
            data: addIntrest,
            updateIntrest,
          });
      } else {
        return response
          .status(200)
          .send({
            status: false,
            message: "Intrest creating error",
            data: null,
          });
      }
    } else {
      return response
        .status(200)
        .send({
          status: true,
          message: `Already ${findIntrest.intrest_name} is available`,
          data: null,
        });
    }
  } catch (error) {
    console.log({ error: error });
    return response
      .status(500)
      .send({ status: false, message: error.message, data: null });
  }
};

//Add Data Using Excel Sheet
const uploadIntrest = async (request, response) => {
  try {
    if (!request.file) {
      return response
        .status(500)
        .send({
          status: false,
          message: "please provide valid image/Vidieo/Audio/GIF/Text",
          data: null,
        });
    }
    importExcelData2MongoDB(request.file.path);

    async function importExcelData2MongoDB(filePath) {
      const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [
          {
            name: "Sheet1",
            header: {
              rows: 1,
            },

            columnToKey: {
              A: "user_id",
              B: "intrest_category",
              C: "intrest_name",
            },
          },
        ],
      });

      const intrests = excelData.Sheet1;
      const interestData = [];
      for (let data of intrests) {
        const isHaveCategory = interestData.find(
          (item) => item.intrest_category === data.intrest_category
        );
        if (isHaveCategory) {
          interestData.map((item) => {
            console.log({
              intrest_name: [...item.intrest_name, data.intrest_name],
              condition: item.intrest_category === data.intrest_category,
            });
            if (item.intrest_category === data.intrest_category) {
              item.intrest_name.push(data.intrest_name);
            }
            return item;
          });
        } else {
          let interest = {
            intrest_category: data.intrest_category,
            intrest_name: [data.intrest_name],
          };
          interestData.push(interest);
        }
      }

      let IntrestData = await intrestModel.insertMany(interestData, {
        new: true,
      });
      if (IntrestData) {
        return response
          .status(200)
          .send({
            status: true,
            message: "Data uploaded successfully",
            data: IntrestData,
          });
      } else {
        return response
          .status(200)
          .send({ status: false, message: "Data not uploaded", data: null });
      }
    }
  } catch (error) {
    return response
      .status(500)
      .send({ status: false, message: error.message, data: null });
  }
};

//Search Intrest
const searchIntrest = async(request , response) => {
    try{
        const
        {
            intrest_name
        } = request.body;

        if (!validator.isValidRequestBody(request.body)) {
            return response
              .status(200)
              .send({ status: false, message: "please provide valid request body" });
          }
         if (!validator.isValid(intrest_name)) {
            return response
                .status(200)
                .send({ status: false, message: "please provide valid intrest name" });
        }

        var search = new RegExp(intrest_name);
        
        // console.log({search  :search })

        // const searchIntrest = await intrestModel.findOne({
        //     intrest_name: {$regex: search , $options: "i"}
        //  })

        const searchIntrest =  intrestModel.aggregate(
            [
                { "$project": { "matched": { "$arrayElemAt": [ intrest_name, search ] } } } 
            ] 
        )

        if(searchIntrest)
        {
            return response.status(200).send({status : true , message :"Intrest get successfully", data :searchIntrest})
        }
        else{
            return response.status(200).send({status : false , message :"Not Found", data : null})
        }

    }catch(error)
    {
        return response.status(500).send({status : false , message :error.message , data : null})
    }
}

module.exports = {
    createIntrest,
    uploadIntrest,
    searchIntrest
}
