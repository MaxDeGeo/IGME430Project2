const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let MessageModel = {};

const convertId = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
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

MessageSchema.statics.toAPI = (doc) => ({
  text: doc.text,
  owner: doc.owner,
  chat: doc.chat,
});

MessageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return MessageModel.find(search).select('text owner chat').lean().exec(callback);
};

MessageModel = mongoose.model('Message', MessageSchema);

module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;
