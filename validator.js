const mongoose = require("mongoose");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const phoneRegex = /^[6-9]\d{9}$/;

const validPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/;



const validEmail = function (email) {
  return emailRegex.test(email);
};

const validPhone = function (phone) {
  return phoneRegex.test(phone);
};
const isvalidPassword=function(password){
    return validPassword.test(password)
};


const isValid = function (value) {
  if (typeof value === "object" && value.length === 0) return false;
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  if (typeof value == "Boolean") return true;
  return true;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};



module.exports = {
  validEmail,
  validPhone,
  isvalidPassword,
  isValid,
  isValidRequestBody,
  isValidObjectId,
 
};
