const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
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
    image: '',
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
      image: req.body.image,
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

const updateChatName = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.query);

  const updatedData = {
    name: req.query.title,
  };

  return Chat.ChatModel.updateOne({ _id: req.query.chatId },
    { $set: updatedData }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return Chat.ChatModel.findOne({ _id: req.query.chatId }, (err2, doc2) => {
        if (err2) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ chat: doc2 });
      });
    });
};

const editChatImage = async (request, response) => {
  const req = request;
  const res = response;

  const { file } = req;
  if (file.detectedFileExtension !== '.jpg' && file.detectedFileExtension !== '.png' && file.detectedFileExtension !== '.gif') {
    return res.json({ error: 'Invalid file type' });
  }

  const fileName = `${req.body.id}_profile_img${file.detectedFileExtension}`;

  await pipeline(file.stream, fs.createWriteStream(`${__dirname}/../../hosted/img/${fileName}`));

  const chatData = {
    image: `assets/img/${fileName}`,
  };

  Chat.ChatModel.updateOne({ _id: req.body.id },
    { $set: chatData }, (error) => {
      if (error) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.json({ imagePath: `assets/img/${fileName}` });
    });
};

const deleteChat = (request, response) => {
  const req = request;
  const res = response;

  Chat.ChatModel.deleteOne({ _id: req.query.chatId }, (err) => {
    if (err) {
      return res.status(400).json({ response: 'failed' });
    }

    return res.json({ response: 'success' });
  });
};

module.exports.getChatRooms = getChatRooms;
module.exports.getChatRoom = getChatRoom;
module.exports.createChatRoom = createChatRoom;
module.exports.updateChatRoom = updateChatRoom;
module.exports.updateChatName = updateChatName;
module.exports.editChatImage = editChatImage;
module.exports.deleteChat = deleteChat;
