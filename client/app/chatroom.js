let socket = io(); //For Socket.io
let globalCSRF;

const handleCreate = (e, id, csrf) => {
  e.preventDefault();

  const fields = {
    ids: ["#chatName", "#chatLimit"],
    failures: [false, false],
  }

  document.querySelector("#chatLimitError").style.display = "none";

  for (let i = 0; i < fields.ids.length; i++) {
    if ($(fields.ids[i]).val() == '') {
      fields.failures[i] = true;
    }
  }

  for (let i = 0; i < fields.ids.length; i++) {
    if (fields.failures[i]) {
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

  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), () => {
    loadChatRoomsFromServer(globalCSRF);
  });

  socket.emit('chat created');
};

const handleImageUpload = (e, csrf, route, chatId) => {
  
  const data = new FormData();
  data.append('name', e.target.value);
  data.append('file', e.target.files[0]);
  data.append('id', chatId);

  sendAjaxImg('POST', `${route}?_csrf=${globalCSRF}`, data, () => {
    if (route === '/editProfileImage') {
      sendAjax('GET', `/getUser?_csrf=${globalCSRF}`, null, (data) => {
        ReactDOM.render(
          <AccountPage csrf={globalCSRF} user={data} time={Date.now()} />, document.querySelector('#accountDisplay')
        );
      });
    } else if (route === '/editChatImage') {
      sendAjax('GET', `/getChatRoom?_csrf=${globalCSRF}&id=${chatId}`, null, (data) => {
        ReactDOM.render(
          <ChatEditPage csrf={globalCSRF} chat={data.chat} time={Date.now()}/>, document.querySelector('#chatEditor')
        );
      });
    }
  });
};

const updateChatName = (e, csrf, chatId) => {
  console.log(e.target.value);

  sendAjax('POST', `/changeChatName?_csrf=${globalCSRF}&chatId=${chatId}&title=${e.target.value}`, null, (data) => {
    ReactDOM.render(
      <ChatEditPage csrf={globalCSRF} chat={data.chat} time={Date.now()}/>, document.querySelector('#chatEditor')
    );

    loadChatRoomsFromServer(globalCSRF);

    sendAjax('GET', `/getUser?_csrf=${globalCSRF}`, null, (result) => {
      ReactDOM.render(
        <Chat csrf={globalCSRF} title={data.chat.name} messages={data.chat.messages} chatId={chatId} currentUser={result._id} />, document.querySelector('#activeChat')
      );
    })
  })
};

const handleChatDelete = (e, csrf, chatId) => {
  sendAjax('POST', `/deleteChat?_csrf=${globalCSRF}&chatId=${chatId}`, null, (data) => {
    if (data.response === "success") {
      closeForm("#chatEditor");

      loadChatRoomsFromServer(globalCSRF);

      ReactDOM.render(
        <Chat csrf={globalCSRF} />, document.querySelector('#activeChat')
      );

      sendAjax('POST', `/updateUsers?_csrf=${globalCSRF}&chatId=${chatId}`, null, null);

      socket.emit('update chats');
    }
  });
}

const ChatList = (props) => {
  const csrf = props.csrf;

  if (props.chats.length === 0) {
    return (
      <div className="chatsContainer">
        <div className="missingChats"><h4 className="header4">Hmm</h4><br />
        It looks like there are currently no chat rooms to join.<br /><br />
        <span className="link bold" onClick={() => openForm("#chatCreator")}>Create a new chat</span>, or wait until one is created.</div>
      </div>
    )
  }

  const chatList = props.chats.map(function(chat) {
    return (
      <div key={chat._id} className="listedChat" onClick={() => loadChat(chat._id, csrf)}>
        <img className="listedChatIcon" src={chat.image !== "" ? chat.image : 'assets/img/chatPlaceholder.jpg' } />
        <div className="chatTextSec">
          <h5 className="listedChatName">{chat.name}</h5>
          {chat.messages.length > 0 ? <p className="previousMessage"><b>{chat.messages[chat.messages.length - 1].user}:</b> {chat.messages[chat.messages.length - 1].message}</p> : <p className="previousMessage">...</p>}
          {chat.owner === props.currentUser ? <p className="chatEditButton" onClick={() => {EditChatWindow(csrf, chat); openForm("#chatEditor");}}>Edit</p> : null}
        </div>
      </div>
    )
  });

  return (
    <div className="chatsContainer">
      <div id="chatsCondensor"><p onClick={(e) => displayChat(e)}>=</p></div>
      {chatList}
      <div className="chatCreator" onClick={() => openForm("#chatCreator")}>
        <div className="listedChatIcon createChatButton">
          <div className="addButtonIco">+</div>
        </div>
      </div>
    </div>
  )
};

const ChatForm = (props) => {
  return (
    <form id="chatForm"
      onSubmit={handleCreate}
      name="chatForm"
      action="/createChat"
      method="POST"
      className="formBody">
        <div className="closeButton" onClick={() => closeForm("#chatCreator")}>x</div>
        <div className="formField">
          <h2 className="formTitle">Create a Chat Room</h2>
          <div className="formInput">
            <label className="labelText" htmlFor="chatName">Name: </label>
            <input className="fullInput" id="chatName" type="text" name="chatName" />
          </div>
          <div className="formInput">
            <label className="labelText" htmlFor="chatLimit">Maximum Occupancy: </label>
            <input className="fullInput" id="chatLimit" type="number" name="chatLimit" />
            <div className="inputError" id="chatLimitError">Must be greater than 1.</div>
          </div>
        </div>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" name="Make Chat" />
    </form>
  )
};

const AccountPage = (props) => {
  return (
    <div id="accountWindow" key={`${props.user.user.image}-${props.time}`}>
      <div className="closeButton" onClick={() => closeForm("#accountDisplay")}>x</div>
      <div className="accountFlex">
        <div className="accountImage">
          <img key={`${props.user.user.image}-img-${props.time}`} className="accImg" src={props.user.user.image !== "" ? props.user.user.image : 'assets/img/proPlaceholder.png' } />
          <input type="file" className="proImgUp" accept=".png, .jpg, .jpeg, .gif" onChange={(e) => handleImageUpload(e, props.csrf, '/editProfileImage')} />
        </div>
        <div className="accountDesc">
          <div>{props.user.user.username}</div>
          <div>{props.user.user.email}</div>
        </div>
      </div>
      <a href="/changePassword" className="passwordButton">Change Password</a>
    </div>
  )
};

const ChatEditPage = (props) => {
  return (
    <div key={props.time} id="chatWindow">
      <div className="closeButton" onClick={() => closeForm("#chatEditor")}>x</div>
      <div className="accountFlex">
        <div className="accountImage">
          <img className="accImg" src={props.chat.image !== "" ? props.chat.image : 'assets/img/chatPlaceholder.jpg' } />
          <input type="file" className="proImgUp" accept=".png, .jpg, .jpeg, .gif" onChange={(e) => handleImageUpload(e, props.csrf, '/editChatImage', props.chat._id)} />
        </div>
        <div className="accountDesc">
          <input className="editChatName" defaultValue={props.chat.name} placeholder="Enter the name for the chat room" onBlur={(e) => updateChatName(e, props.csrf, props.chat._id)} />
        </div>
      </div>
      <div className="passwordButton" onClick={(e) => handleChatDelete(e, props.csrf, props.chat._id)}>Delete Chat</div>
    </div>
  )
};

const Chat = (props) => {
  const csrf = props.csrf;
  const chatId = props.chatId
  let messages;
  if (props.title) {
    messages = props.messages.map(function(message) {
      return (
        <div key={message.messageId} className="messageFlex">
        <img className="messageImage" src={message.image ? message.image : "/assets/img/proPlaceholder.png"} alt="Profile Image" />
        <div className="messageData">
          <div className="messageName">{message.user}</div>
          <div className="messageText">{message.message}</div>
        </div>
      </div>
      )
    });
  }
  
  return (
    <div className="chatContainer">
      <div id="chatTitle">
        <h3 id="chatTitleText">{props.title}</h3>
      </div>
      <div id="chatSection">
        {messages}
      </div>
      <div id="inputSection">
        { props.title ? 
          <textarea className="messageBox" placeholder="Send a message" onKeyDown={(e) => sendMessage(e, chatId, csrf)}></textarea>
          // <span className="textarea" role="textbox" contentEditable></span>
          :
          <span></span>
        }
      </div>
    </div>
  )
};

const Ads = (props) => {
  return (
    <div className="adContainer">
      <img alt="temp ad 1 image" src="/assets/img/fa1.png" className="faSection" />
      <img alt="temp ad 2 image" src="/assets/img/fa2.png" className="faSection" />
    </div>
  )
};

const sendMessage = (e, chatId, csrf) => {
  if (!e.shiftKey) {
    if (e.keyCode === 13) {
      e.preventDefault();

      if (e.target.value.trim() !== "") {
        let msg = e.target.value.trim();
        const serializedField = `_csrf=${globalCSRF}&message=${e.target.value.trim()}`
        sendAjax('POST', '/createMessage', serializedField, (data) => {
          sendAjax('GET', '/getUser', `_csrf=${globalCSRF}`, (user) => {
            const serializedFieldChat = `message=${data.messageData.text}&user=${data.messageData.user}&messageId=${data.messageData.messageId}&chatId=${chatId}&image=${user.user.image}&_csrf=${globalCSRF}`;
            sendAjax('POST', '/updateChat', serializedFieldChat, (response) => {
              loadChat(chatId, csrf);
              clearChat();
              socket.emit('chat message', msg);
            });
          })
        });
      }
    }
  }
};

const loadChatRoomsFromServer = (csrf) => {
  sendAjax('GET', '/getChatRooms', null, (data) => {
    sendAjax('GET', `/getUser?_csrf=${globalCSRF}`, null, (user) => {
      ReactDOM.render(
        <ChatList csrf={globalCSRF} chats={data.chats} currentUser={user.user._id} />, document.querySelector("#chats")
      );
    })
  });
};

const loadChat = (chatId, csrf) => {
  const serializedField = `id=${chatId}&_csrf=${globalCSRF}`;
  sendAjax('GET', `/getChatRoom?${serializedField}`, null, (data) => {
    ReactDOM.render(
      <Chat csrf={globalCSRF} title={data.chat.name} messages={data.chat.messages} chatId={chatId} currentUser={data.activeUser}/>, document.querySelector("#activeChat")
    );
    var chat = document.querySelector("#chatSection");
    chat.scrollTop = chat.scrollHeight;

    sendAjax('POST', `/setChat?chatId=${chatId}&_csrf=${globalCSRF}`, null, null)
  });
};

const AccountTabFooter = (props) => {
  return (
    <div className="accountFooterFlex">
      <div className="footProfLeft">
        <div className="footerProfileImg" onClick={() => openForm('#accountDisplay')}>
          <img src={props.user.image !== "" ? props.user.image : "/assets/img/proPlaceholder.png"} />
          <div>View</div>
        </div>
        <div className="footerProfileName">
          {props.user.username ? <p>{props.user.username}</p> : <p>...</p>}
          <a className="logoutText" href="/logout">Log out</a>
        </div>
      </div>
    </div>
  );
};

const getUser = (csrf) => {
  sendAjax('GET', `/getUser`, null, (data) => {
    ReactDOM.render(
      <AccountTabFooter csrf={globalCSRF} user={data.user} />, document.querySelector('#accountFooter')
    );
  });
}

const EditChatWindow = (csrf, props) => {
  //React Element #7
  ReactDOM.render(
    <ChatEditPage csrf={globalCSRF} chat={props} time={Date.now()} />, document.querySelector('#chatEditor')
  );
}

const setup = function(csrf) {
  globalCSRF = csrf; //For Socket.io

  //React Element #1
  ReactDOM.render(
    <ChatList csrf={globalCSRF} chats={[]} />, document.querySelector('#chats')
  );

  //React Element #2
  sendAjax('GET', `/getChat?_csrf=${globalCSRF}`, null, (data) => {
    if (data.activeChat) {
      loadChat(data.activeChat, globalCSRF);
    } else {
      ReactDOM.render(
        <Chat csrf={globalCSRF} />, document.querySelector('#activeChat')
      );

      var chat = document.querySelector("#chatSection");
      chat.scrollTop = chat.scrollHeight;
    }
  })

  //React Element #3
  ReactDOM.render(
    <Ads csrf={globalCSRF} />, document.querySelector('#ads')
  );

  //React Element #4
  getUser(globalCSRF);

  //React Element #5
  ReactDOM.render(
    <ChatForm csrf={globalCSRF} />, document.querySelector('#chatCreator')
  );

  //React Element #6
  sendAjax('GET', `/getUser?_csrf=${globalCSRF}`, null, (data) => {
    ReactDOM.render(
      <AccountPage csrf={globalCSRF} user={data} time={Date.now()} />, document.querySelector('#accountDisplay')
    );
  });

  loadChatRoomsFromServer(globalCSRF);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();

});

// SOCKET.IO EMIT
socket.on('chat message', (msg) => {
  sendAjax('GET', `/getUser?_csrf=${globalCSRF}`, null, (user) => {
    loadChat(user.user.chat, globalCSRF);
  })
});

socket.on('update chats', () => {
  sendAjax('GET', `/getUser?_csrf=${globalCSRF}`, null, (user) => {
    if (user.activeChat) {
      loadChat(user.activeChat, globalCSRF);
    } else {
      ReactDOM.render(
        <Chat csrf={globalCSRF} />, document.querySelector('#activeChat')
      );

      var chat = document.querySelector("#chatSection");
      chat.scrollTop = chat.scrollHeight;
    }
  })

  loadChatRoomsFromServer(globalCSRF);
});

socket.on('chat created', () => {
  console.log(globalCSRF);
  loadChatRoomsFromServer(globalCSRF);
});
