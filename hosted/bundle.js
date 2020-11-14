"use strict";

var handleCreate = function handleCreate(e, id, csrf) {
  e.preventDefault();
  var fields = {
    ids: ["#chatName", "#chatLimit"],
    failures: [false, false]
  };
  document.querySelector("#chatLimitError").style.display = "none";

  for (var i = 0; i < fields.ids.length; i++) {
    if ($(fields.ids[i]).val() == '') {
      fields.failures[i] = true;
    }
  }

  for (var _i = 0; _i < fields.ids.length; _i++) {
    if (fields.failures[_i]) {
      handleError(fields);
      return false;
    }
  }

  if ($("#chatLimit").val() <= 1) {
    fields.failures[1] = true;
    handleError(fields);
    document.querySelector("#chatLimitError").style.display = "block ";
    return false;
  }

  closeForm('#chatCreator');
  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    loadChatRoomsFromServer(csrf);
  });
};

var ChatList = function ChatList(props) {
  var csrf = props.csrf;

  if (props.chats.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "chatsContainer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "missingChats"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "header4"
    }, "Hmm"), /*#__PURE__*/React.createElement("br", null), "It looks like there are currently no chat rooms to join.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      className: "link bold",
      onClick: function onClick() {
        return openForm("#chatCreator");
      }
    }, "Create a new chat"), ", or wait until one is created."));
  }

  var chatList = props.chats.map(function (chat) {
    console.log(chat);
    return /*#__PURE__*/React.createElement("div", {
      key: chat._id,
      className: "listedChat",
      onClick: function onClick() {
        return loadChat(chat._id, csrf);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "listedChatIcon"
    }), /*#__PURE__*/React.createElement("div", {
      className: "chatTextSec"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "listedChatName"
    }, chat.name), chat.messages.length > 0 ? /*#__PURE__*/React.createElement("p", {
      className: "previousMessage"
    }, /*#__PURE__*/React.createElement("b", null, chat.messages[chat.messages.length - 1].user, ":"), " ", chat.messages[chat.messages.length - 1].message) : /*#__PURE__*/React.createElement("p", {
      className: "previousMessage"
    }, "...")));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "chatsContainer"
  }, /*#__PURE__*/React.createElement("div", {
    id: "chatsCondensor"
  }, /*#__PURE__*/React.createElement("p", {
    onClick: function onClick(e) {
      return displayChat(e);
    }
  }, "=")), chatList, /*#__PURE__*/React.createElement("div", {
    className: "chatCreator",
    onClick: function onClick() {
      return openForm("#chatCreator");
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "listedChatIcon createChatButton"
  }, /*#__PURE__*/React.createElement("div", {
    className: "addButtonIco"
  }, "+"))));
};

var ChatForm = function ChatForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "chatForm",
    onSubmit: handleCreate,
    name: "chatForm",
    action: "/createChat",
    method: "POST",
    className: "formBody"
  }, /*#__PURE__*/React.createElement("div", {
    className: "closeButton",
    onClick: function onClick() {
      return closeForm("#chatCreator");
    }
  }, "x"), /*#__PURE__*/React.createElement("div", {
    className: "formField"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "formTitle"
  }, "Create a Chat Room"), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "chatName"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "chatName",
    type: "text",
    name: "chatName"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "chatLimit"
  }, "Maximum Occupancy: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "chatLimit",
    type: "number",
    name: "chatLimit"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inputError",
    id: "chatLimitError"
  }, "Must be greater than 1."))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    name: "Make Chat"
  }));
};

var Chat = function Chat(props) {
  var csrf = props.csrf;
  var chatId = props.chatId;
  var messages;

  if (props.title) {
    messages = props.messages.map(function (message) {
      return /*#__PURE__*/React.createElement("div", {
        key: message.messageId,
        className: "messageFlex"
      }, /*#__PURE__*/React.createElement("img", {
        className: "messageImage",
        src: message.profileImage ? message.profileImage : "/assets/img/proPlaceholder.png",
        alt: "Profile Image"
      }), /*#__PURE__*/React.createElement("div", {
        className: "messageData"
      }, /*#__PURE__*/React.createElement("div", {
        className: "messageName"
      }, message.user), /*#__PURE__*/React.createElement("div", {
        className: "messageText"
      }, message.message)));
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "chatContainer"
  }, /*#__PURE__*/React.createElement("div", {
    id: "chatTitle"
  }, /*#__PURE__*/React.createElement("h3", {
    id: "chatTitleText"
  }, props.title)), /*#__PURE__*/React.createElement("div", {
    id: "chatSection"
  }, messages), /*#__PURE__*/React.createElement("div", {
    id: "inputSection"
  }, props.title ? /*#__PURE__*/React.createElement("textarea", {
    className: "messageBox",
    placeholder: "Send a message",
    onKeyDown: function onKeyDown(e) {
      return sendMessage(e, chatId, csrf);
    }
  }) // <span className="textarea" role="textbox" contentEditable></span>
  :
  /*#__PURE__*/
  React.createElement("span", null)));
};

var Ads = function Ads(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adContainer"
  }, /*#__PURE__*/React.createElement("img", {
    alt: "temp ad 1 image",
    src: "/assets/img/fa1.png",
    className: "faSection"
  }), /*#__PURE__*/React.createElement("img", {
    alt: "temp ad 2 image",
    src: "/assets/img/fa2.png",
    className: "faSection"
  }));
};

var sendMessage = function sendMessage(e, chatId, csrf) {
  if (!e.shiftKey) {
    if (e.keyCode === 13) {
      e.preventDefault();

      if (e.target.value.trim() !== "") {
        var serializedField = "message=".concat(e.target.value.trim(), "&_csrf=").concat(csrf);
        sendAjax('POST', '/createMessage', serializedField, function (data) {
          var serializedFieldChat = "message=".concat(data.messageData.text, "&user=").concat(data.messageData.user, "&messageId=").concat(data.messageData.messageId, "&chatId=").concat(chatId, "&_csrf=").concat(csrf);
          sendAjax('POST', '/updateChat', serializedFieldChat, function (response) {
            loadChat(chatId, csrf);
            clearChat();
          });
        });
      }
    }
  }
};

var loadChatRoomsFromServer = function loadChatRoomsFromServer(csrf) {
  sendAjax('GET', '/getChatRooms', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
      csrf: csrf,
      chats: data.chats
    }), document.querySelector("#chats"));
  });
};

var loadChat = function loadChat(chatId, csrf) {
  var serializedField = "id=".concat(chatId, "&_csrf=").concat(csrf);
  sendAjax('GET', "/getChatRoom?".concat(serializedField), null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Chat, {
      csrf: csrf,
      title: data.chat.name,
      messages: data.chat.messages,
      chatId: chatId,
      currentUser: data.activeUser
    }), document.querySelector("#activeChat"));
    sendAjax('POST', "/setChat?chatId=".concat(chatId, "&_csrf=").concat(csrf), null, null);
  });
};

var AccountTabFooter = function AccountTabFooter(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "accountFooterFlex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footProfLeft"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footerProfileImg"
  }, /*#__PURE__*/React.createElement("div", null, "View")), /*#__PURE__*/React.createElement("div", {
    className: "footerProfileName"
  }, props.username ? /*#__PURE__*/React.createElement("p", null, props.username) : /*#__PURE__*/React.createElement("p", null, "Test User"), /*#__PURE__*/React.createElement("a", {
    className: "logoutText",
    href: "/logout"
  }, "Log out"))));
};

var getUser = function getUser(csrf) {
  sendAjax('GET', "/getUser", null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountTabFooter, {
      csrf: csrf,
      username: data.username
    }), document.querySelector('#accountFooter'));
  });
};

var setup = function setup(csrf) {
  //React Element #1
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
    csrf: csrf,
    chats: []
  }), document.querySelector('#chats')); //React Element #2

  sendAjax('GET', "/getChat?_csrf=".concat(csrf), null, function (data) {
    if (data.activeChat) {
      loadChat(data.activeChat, csrf);
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement(Chat, {
        csrf: csrf
      }), document.querySelector('#activeChat'));
    }
  }); //React Element #3

  ReactDOM.render( /*#__PURE__*/React.createElement(Ads, {
    csrf: csrf
  }), document.querySelector('#ads')); //React Element #4

  getUser(csrf); //React Element #5

  ReactDOM.render( /*#__PURE__*/React.createElement(ChatForm, {
    csrf: csrf
  }), document.querySelector('#chatCreator'));
  loadChatRoomsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(fields) {
  for (var i = 0; i < fields.failures.length; i++) {
    if (fields.failures[i]) {
      document.querySelector(fields.ids[i]).style.borderColor = '#ff0000';
    } else {
      document.querySelector(fields.ids[i]).style.borderColor = '#b1b1b1a2';
    }
  }
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var openForm = function openForm(id) {
  document.querySelector(id).style.visibility = 'visible';
  document.querySelector(id).style.opacity = 1;
};

var closeForm = function closeForm(id) {
  document.querySelector(id).style.visibility = 'hidden';
  document.querySelector(id).style.opacity = 0;
};

var hasText = function hasText() {
  var box = document.querySelector('.messageBox');
  return true; // return box.textContent && box.textContent.trim.length > 0;
};

var clearChat = function clearChat() {
  var box = document.querySelector('.messageBox');
  box.value = '';
};

var displayChat = function displayChat(e) {
  var leftBar = document.querySelector('#leftBar');
  var mainContent = document.querySelector('#activeChat');
  var chatNames = document.querySelectorAll('.chatTextSec');
  var inputSection = document.querySelector('#inputSection');
  var profileFooter = document.querySelector('.footerProfileName');
  var profileImage = document.querySelector('.footerProfileImg');
  var addButton = document.querySelector('.addButtonIco');

  if (leftBar.style.width === '73px') {
    leftBar.style.width = 'calc(20% - 1px)';
    mainContent.style.width = 'calc(60% - 2px)';
    inputSection.style.width = 'calc(60% - 3px)';
    e.target.parentElement.style.textAlign = 'right';

    for (var i = 0; i < chatNames.length; i++) {
      chatNames[i].style.display = 'block';
    }

    profileFooter.style.display = 'block';
    profileImage.style.marginLeft = '5px';
    addButton.style.marginLeft = '14px';
  } else {
    e.target.parentElement.style.textAlign = 'center';
    leftBar.style.width = '73px';
    mainContent.style.width = 'calc(80% - 74px)';
    inputSection.style.width = 'calc(80% - 76px)';

    for (var _i = 0; _i < chatNames.length; _i++) {
      chatNames[_i].style.display = 'none';
    }

    profileFooter.style.display = 'none';
    profileImage.style.marginLeft = '16px';
    addButton.style.marginLeft = '13px';
  }
};
