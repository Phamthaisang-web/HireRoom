const messageModel = require("../models/message.model");

const sendMessage = async (data) => {
  return await messageModel.createMessage(data);
};

module.exports = {
  sendMessage,
};