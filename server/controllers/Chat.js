const models = require('../models');

const { Chat } = models;

const getChatRooms = (request, response) => {
  const res = response;

  return Chat.ChatModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ chats: docs });
  });
};

const createChatRoom = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.chatName || !req.body.chatLimit) {
    return res.status(400).json({ error: 'Both fields must be present' });
  }

  const chatData = {
    name: req.body.chatName,
    maxOcc: req.body.chatLimit,
    owner: req.session.account._id,
  };

  const newChat = new Chat.ChatModel(chatData);

  const chatPromise = newChat.save();

  chatPromise.then(() => res.json({ redirect: '/home' }));

  chatPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Chat already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return chatPromise;
};

const getChatRoom = (request, response) => {
  const req = request;
  const res = response;

  return Chat.ChatModel.findOne({ _id: req.query.id }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ chat: doc, activeUser: req.session.account._id });
  });
};

const updateChatRoom = (request, response) => {
  const req = request;
  const res = response;

  return Chat.ChatModel.findOne({ _id: req.body.chatId }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    const tempArray = doc.messages;

    const newMessage = {
      user: req.body.user,
      message: req.body.message,
      messageId: req.body.messageId,
    };

    if (req.body.messageId) {
      tempArray.push(newMessage);
    }

    const updatedData = {
      // name: req.body.name ? req.body.name : doc.name,
      // maxOcc: req.body.maxOcc ? req.body.maxOcc : doc.maxOcc,
      messages: tempArray,
      // owner: req.body.owner ? req.body.owner : doc.owner,
    };

    return Chat.ChatModel.updateOne({ _id: req.body.chatId },
      { $set: updatedData }, (err2, doc2) => {
        if (err2) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ chat: doc2 });
      });
  });
};

module.exports.getChatRooms = getChatRooms;
module.exports.getChatRoom = getChatRoom;
module.exports.createChatRoom = createChatRoom;
module.exports.updateChatRoom = updateChatRoom;
