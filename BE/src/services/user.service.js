const userModel = require("../models/user.model");

const getAllUsers = async () => {
  return await userModel.getAllUsers();
};



module.exports = {
  getAllUsers,
 
};