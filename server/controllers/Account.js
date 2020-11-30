const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // Force cast to trings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast to string to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  req.body.email = `${req.body.email}`;
  req.body.email2 = `${req.body.email2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2
    || !req.body.email || !req.body.email2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (req.body.email !== req.body.email2) {
    return res.status(400).json({ error: 'Emails do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      email: req.body.email,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/home' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (Error.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const passwordChangePage = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.username, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('password', { csrfToken: req.csrfToken() });
  });
};

const passwordChange = (request, response) => {
  const req = request;
  const res = response;

  const { _id, username } = req.session.account;

  // Validate Password
  return Account.AccountModel.authenticate(username, req.body.current, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password' });
    }
    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      const accountData = {
        username: account.username,
        salt,
        password: hash,
        email: account.email,
      };

      Account.AccountModel.updateOne({ _id }, { $set: accountData }, (error) => {
        if (error) {
          console.log(err);
          return res.render('password', { error: 'An error occurred' });
        }

        return res.render('app', { csrfToken: req.csrfToken() });
      });
    });

    // req.session.account = Account.AccountModel.toAPI(account);

    // return res.json({ redirect: '/home' });
  });
};

const homePage = (request, response) => {
  const req = request;
  const res = response;
  return res.render('app', { csrfToken: req.csrfToken() });
};

const getUser = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ user: doc });
  });

  // return res.json({ username: req.session.account.username });
};

const getChat = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ activeChat: doc.chat });
  });
};

const setChat = (request, response) => {
  const req = request;
  const res = response;

  const accountData = {
    chat: req.query.chatId,
  };
  Account.AccountModel.updateOne({ _id: req.session.account._id },
    { $set: accountData }, (error) => {
      if (error) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.json({ chat: req.query.chatId });
    });
};

const editProfileImage = async (request, response) => {
  const req = request;
  const res = response;

  const { file } = req;
  if (file.detectedFileExtension !== '.jpg' && file.detectedFileExtension !== '.png' && file.detectedFileExtension !== '.gif') {
    return res.json({ error: 'Invalid file type' });
  }

  const fileName = `${req.session.account._id}_profile_img${file.detectedFileExtension}`;

  await pipeline(file.stream, fs.createWriteStream(`${__dirname}/../../hosted/img/${fileName}`));

  const accountData = {
    image: `assets/img/${fileName}`,
  };

  Account.AccountModel.updateOne({ _id: req.session.account._id },
    { $set: accountData }, (error) => {
      if (error) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.json({ imagePath: `assets/img/${fileName}` });
    });

  return false;
};

const updateUsers = (request, response) => {
  const req = request;
  const res = response;

  const updatedData = {
    chat: 1,
  };

  Account.AccountModel.updateMany({ chat: req.query.chatId }, { $unset: updatedData }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ response: 'success' });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.passwordChangePage = passwordChangePage;
module.exports.passwordChange = passwordChange;
module.exports.homePage = homePage;
module.exports.getUser = getUser;
module.exports.getChat = getChat;
module.exports.setChat = setChat;
module.exports.editProfileImage = editProfileImage;
module.exports.updateUsers = updateUsers;
