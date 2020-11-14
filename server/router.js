const controllers = require('./controllers');
const mid = require('./middleware');

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
  app.get('/getUser', mid.requiresLogin, controllers.Account.getUser);
  app.get('/getChat', mid.requiresLogin, controllers.Account.getChat);
  app.post('/setChat', mid.requiresLogin, controllers.Account.setChat);
  app.get('/home', mid.requiresLogin, controllers.Account.homePage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
