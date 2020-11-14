const models = require('../models');

const { Message } = models;

const createMessage = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.message || !req.session.account._id) {
    return res.status(400).json({ error: 'Both fields must be present' });
  }

  const messageData = {
    text: req.body.message,
    owner: req.session.account._id,
  };

  const newMessage = new Message.MessageModel(messageData);
  const messagePromise = newMessage.save();

  messageData.messageId = newMessage._id;
  messageData.user = req.session.account.username;

  messagePromise.then(() => res.json({ messageData, redirect: '/home' }));

  messagePromise.catch((err) => {
    console.log(err);
    // if (err.code === 11000) {
    //   return res.status(400).json({ error: 'Chat already exists' });
    // }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return messagePromise;
};

module.exports.createMessage = createMessage;
