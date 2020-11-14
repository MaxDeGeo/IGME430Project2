const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let ChatModel = {};

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  maxOcc: {
    type: Number,
    required: true,
  },
  messages: {
    type: Array,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ChatSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  name: doc.name,
  owner: doc.owner,
  _id: doc._id,
});

ChatSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return ChatModel.findOne(search, callback);
};

ChatModel = mongoose.model('Chat', ChatSchema);

module.exports.ChatModel = ChatModel;
module.exports.ChatSchema = ChatSchema;
