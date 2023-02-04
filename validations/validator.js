
// validation file

const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};
const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};

module.exports = {
    isValid,
    isValidObjectId,
    isValidRequestBody
}

// const Validator = require('validatorjs');
// const validator = async (body, rules, customMessages, callback) => {
//     const validation = new Validator(body, rules, customMessages);
//     validation.passes(() => callback(null, true));
//     validation.fails(() => callback(validation.errors, false));
// };
// module.exports = validator;


// const validationRule = {
//     // "email": "required|string|email|exist:users,email",
//     "email": "required|string|email",
//     "name": "required|string",
//     "user_type": "required|string",
//     "mobile_no": "required|string|min:10|max:10",
//     // "mobile_no": "required|string|min:10|max:10",
//    // "password": "required|string|min:6|confirmed",
//    // "gender": "string"
// };

// let validation = new Validator(request.body, validationRule);

//  validation.passes(); // true
//  validation.fails(); // false
//   await validator(request.body, validationRule, {}, (err, status) => {
//         if (!status) {
//             response.status(400)
//                 .send({
//                     success: false,
//                     message: 'Validation failed',
//                     data: err
//                 });
//         } 
//         else {
   
//           next;
//         }
//     }).catch( error => console.log(error))

