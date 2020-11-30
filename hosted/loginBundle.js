"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  var fields = {
    ids: ["#user", "#pass"],
    failures: [false, false]
  };

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

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  var fields = {
    ids: ["#user", "#email", "#email2", "#pass", "#pass2"],
    failures: [false, false, false, false, false]
  };
  document.querySelector("#userError").style.display = "none";
  document.querySelector("#email2Error").style.display = "none";
  document.querySelector("#pass2Error").style.display = "none";

  for (var i = 0; i < fields.ids.length; i++) {
    if ($(fields.ids[i]).val() == '') {
      fields.failures[i] = true;
    }
  }

  for (var _i2 = 0; _i2 < fields.ids.length; _i2++) {
    if (fields.failures[_i2]) {
      handleError(fields);
      return false;
    }
  }

  if ($("#email").val() !== $("#email2").val()) {
    fields.failures[2] = true;
    handleError(fields);
    document.querySelector("#email2Error").style.display = "block ";
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    fields.failures[4] = true;
    handleError(fields);
    document.querySelector("#pass2Error").style.display = "block";
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var handlePasswordChange = function handlePasswordChange(e) {
  e.preventDefault(); //UPDATE TO NEW FORM VALIDATION

  var fields = {
    ids: ["#current", "#newPass", "#newPass2"],
    failures: [false, false, false]
  };
  document.querySelector("#newPass2Error").style.display = "none";

  for (var i = 0; i < fields.ids.length; i++) {
    if ($(fields.ids[i]).val() == '') {
      fields.failures[i] = true;
    }
  }

  for (var _i3 = 0; _i3 < fields.ids.length; _i3++) {
    if (fields.failures[_i3]) {
      handleError(fields);
      return false;
    }
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    fields.failures[2] = true;
    handleError(fields);
    document.querySelector("#newPass2Error").style.display = "block";
    return false;
  }

  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    className: "formBody",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "formTitle"
  }, "Login"), /*#__PURE__*/React.createElement("div", {
    className: "inputError",
    id: "loginError"
  }, "Username and/or password are wrong."), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "user",
    type: "text",
    name: "username"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "pass",
    type: "password",
    name: "pass"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  }), /*#__PURE__*/React.createElement("div", {
    className: "subtext"
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("span", {
    className: "link",
    onClick: function onClick() {
      return createSignupWindow(props.csrf);
    }
  }, "Create one now"), "."));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    className: "formBody",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "formTitle"
  }, "Sign Up"), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "user",
    type: "text",
    name: "username"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inputError",
    id: "userError"
  }, "Username is already taken.")), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "email"
  }, "Email: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "email",
    type: "text",
    name: "email"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "email2"
  }, "Retype Email: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "email2",
    type: "text",
    name: "email2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inputError",
    id: "email2Error"
  }, "Emails do not match.")), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "pass",
    type: "password",
    name: "pass"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "pass2",
    type: "password",
    name: "pass2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inputError",
    id: "pass2Error"
  }, "Passwords do not match.")), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign up"
  }), /*#__PURE__*/React.createElement("div", {
    className: "subtext"
  }, "Already have an account? ", /*#__PURE__*/React.createElement("span", {
    className: "link",
    onClick: function onClick() {
      return createLoginWindow(props.csrf);
    }
  }, "Login"), "."));
};

var ChangePasswordWindow = function ChangePasswordWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "passwordForm",
    className: "formBody",
    name: "passwordForm",
    onSubmit: handlePasswordChange,
    action: "/changePassword",
    method: "POST"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "formTitle"
  }, "Change Password"), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "currentPassword"
  }, "Current Password: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "current",
    type: "password",
    name: "current"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "newPass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "newPass",
    type: "password",
    name: "newPass"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formInput"
  }, /*#__PURE__*/React.createElement("label", {
    className: "labelText",
    htmlFor: "newPass2"
  }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
    className: "fullInput",
    id: "newPass2",
    type: "password",
    name: "newPass2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inputError",
    id: "newPass2Error"
  }, "Passwords do not match.")), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Update Password"
  }));
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createPasswordWindow = function createPasswordWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePasswordWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var path = window.location.pathname;

  if (path.includes("/changePassword")) {
    createPasswordWindow(csrf);
  } else {
    createLoginWindow(csrf); // Default View
  }
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

var sendAjaxImg = function sendAjaxImg(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    processData: false,
    contentType: false,
    error: function error(xhr, status, _error2) {
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
