const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

const upload = multer();

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/changePassword', mid.requiresLogin, controllers.Account.passwordChangePage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.passwordChange);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/getChatRoom', mid.requiresLogin, controllers.Chat.getChatRoom);
  app.get('/getChatRooms', mid.requiresLogin, controllers.Chat.getChatRooms);
  app.post('/createMessage', mid.requiresLogin, controllers.Message.createMessage);
  app.post('/createChat', mid.requiresLogin, controllers.Chat.createChatRoom);
  app.post('/updateChat', mid.requiresLogin, controllers.Chat.updateChatRoom);
  app.post('/updateUsers', mid.requiresLogin, controllers.Account.updateUsers);
  app.get('/getUser', mid.requiresLogin, controllers.Account.getUser);
  app.get('/getChat', mid.requiresLogin, controllers.Account.getChat);
  app.post('/setChat', mid.requiresLogin, controllers.Account.setChat);
  app.get('/home', mid.requiresLogin, controllers.Account.homePage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/deleteChat', mid.requiresLogin, controllers.Chat.deleteChat);
  app.post('/changeChatName', mid.requiresLogin, controllers.Chat.updateChatName);
  app.post('/editProfileImage', upload.single('file'), controllers.Account.editProfileImage);
  app.post('/editChatImage', upload.single('file'), controllers.Chat.editChatImage);
};

module.exports = router;
