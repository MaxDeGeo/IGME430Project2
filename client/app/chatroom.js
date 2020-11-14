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
    loadChatRoomsFromServer(csrf);
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
    console.log(chat);
    return (
      <div key={chat._id} className="listedChat" onClick={() => loadChat(chat._id, csrf)}>
        <div className="listedChatIcon"></div>
        <div className="chatTextSec">
          <h5 className="listedChatName">{chat.name}</h5>
    {chat.messages.length > 0 ? <p className="previousMessage"><b>{chat.messages[chat.messages.length - 1].user}:</b> {chat.messages[chat.messages.length - 1].message}</p> : <p className="previousMessage">...</p>}
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
}

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
}

const Chat = (props) => {
  const csrf = props.csrf;
  const chatId = props.chatId

  let messages;
  if (props.title) {
    messages = props.messages.map(function(message) {
      return (
        <div key={message.messageId} className="messageFlex">
        <img className="messageImage" src={message.profileImage ? message.profileImage : "/assets/img/proPlaceholder.png"} alt="Profile Image" />
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
}

const Ads = (props) => {
  return (
    <div className="adContainer">
      <img alt="temp ad 1 image" src="/assets/img/fa1.png" className="faSection" />
      <img alt="temp ad 2 image" src="/assets/img/fa2.png" className="faSection" />
    </div>
  )
}

const sendMessage = (e, chatId, csrf) => {
  if (!e.shiftKey) {
    if (e.keyCode === 13) {
      e.preventDefault();

      if (e.target.value.trim() !== "") {
        const serializedField = `message=${e.target.value.trim()}&_csrf=${csrf}`
        sendAjax('POST', '/createMessage', serializedField, (data) => {
          const serializedFieldChat = `message=${data.messageData.text}&user=${data.messageData.user}&messageId=${data.messageData.messageId}&chatId=${chatId}&_csrf=${csrf}`;
          sendAjax('POST', '/updateChat', serializedFieldChat, (response) => {
            loadChat(chatId, csrf);
            clearChat();
          });
        });
      }
    }
  }
}

const loadChatRoomsFromServer = (csrf) => {
  sendAjax('GET', '/getChatRooms', null, (data) => {
    ReactDOM.render(
      <ChatList csrf={csrf} chats={data.chats} />, document.querySelector("#chats")
    );
  });
};

const loadChat = (chatId, csrf) => {
  const serializedField = `id=${chatId}&_csrf=${csrf}`;
  sendAjax('GET', `/getChatRoom?${serializedField}`, null, (data) => {
    ReactDOM.render(
      <Chat csrf={csrf} title={data.chat.name} messages={data.chat.messages} chatId={chatId} currentUser={data.activeUser}/>, document.querySelector("#activeChat")
    );
    
    sendAjax('POST', `/setChat?chatId=${chatId}&_csrf=${csrf}`, null, null)
  });
};

const AccountTabFooter = (props) => {
  return (
    <div className="accountFooterFlex">
      <div className="footProfLeft">
        <div className="footerProfileImg">
          <div>View</div>
        </div>
        <div className="footerProfileName">
          {props.username ? <p>{props.username}</p> : <p>Test User</p>}
          <a className="logoutText" href="/logout">Log out</a>
        </div>
      </div>
    </div>
  );
};

const getUser = (csrf) => {
  sendAjax('GET', `/getUser`, null, (data) => {
    ReactDOM.render(
      <AccountTabFooter csrf={csrf} username={data.username} />, document.querySelector('#accountFooter')
    );
  });
}

const setup = function(csrf) {

  //React Element #1
  ReactDOM.render(
    <ChatList csrf={csrf} chats={[]} />, document.querySelector('#chats')
  );

  //React Element #2
  sendAjax('GET', `/getChat?_csrf=${csrf}`, null, (data) => {
    if (data.activeChat) {
      loadChat(data.activeChat, csrf);
    } else {
      ReactDOM.render(
        <Chat csrf={csrf} />, document.querySelector('#activeChat')
      );
    }
  })

  //React Element #3
  ReactDOM.render(
    <Ads csrf={csrf} />, document.querySelector('#ads')
  );

  //React Element #4
  getUser(csrf);

  //React Element #5
  ReactDOM.render(
    <ChatForm csrf={csrf} />, document.querySelector('#chatCreator')
  );

  loadChatRoomsFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
