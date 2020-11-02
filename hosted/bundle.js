"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $('#domoMessage').animate({
    width: 'hide'
  }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('domoHeight').val() === '' || $('domoWeight').val() === '' || $('domoEyeColor').val() === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  var serial = $('#domoForm').serialize();
  var csrf = serial.split('csrf=')[1];
  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer(csrf);
  });
  return false;
}; // Handles the delete call for the domo based off of unique id of domo


var handleDelete = function handleDelete(e, id, csrf) {
  var domoName = e.target.parentElement.children[1].innerHTML.split(': ')[1];
  var serialize = "id=".concat(id, "&_csrf=").concat(csrf);
  sendAjax('DELETE', '/maker', serialize, function () {
    loadDomosFromServer(csrf);
  });
};

var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "formField"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "domoTitle"
  }, "Create a Domo"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo Name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formField"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formField"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "height"
  }, "Height: "), /*#__PURE__*/React.createElement("input", {
    id: "domoHeight",
    type: "text",
    name: "height",
    placeholder: "Domo Height"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formField"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "weight"
  }, "Weight: "), /*#__PURE__*/React.createElement("input", {
    id: "domoWeight",
    type: "text",
    name: "weight",
    placeholder: "Domo Weight"
  })), /*#__PURE__*/React.createElement("div", {
    className: "formField"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "eyeColor"
  }, "Eye Color: "), /*#__PURE__*/React.createElement("input", {
    id: "domoEyeColor",
    type: "text",
    name: "eyeColor",
    placeholder: "Domo Eye Color"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    name: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  var csrf = props.csrf;

  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domolist"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name), /*#__PURE__*/React.createElement("div", {
      className: "delete",
      onClick: function onClick(e) {
        return handleDelete(e, domo._id, props.csrf);
      }
    }, "x")), /*#__PURE__*/React.createElement("div", {
      className: "flex"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age), /*#__PURE__*/React.createElement("h3", {
      className: "domoEyeColor"
    }, "Eye Color: ", !domo.eyeColor ? 'N/A' : domo.eyeColor)), /*#__PURE__*/React.createElement("div", {
      className: "flex"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "domoHeight"
    }, "Height: ", !domo.height ? 'N/A' : domo.height), /*#__PURE__*/React.createElement("h3", {
      className: "domoWeight"
    }, "Weight: ", !domo.weight ? 'N/A' : domo.weight)));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos,
      csrf: csrf
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: [],
    csrf: csrf
  }), document.querySelector("#domos"));
  loadDomosFromServer(csrf);
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

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({
    width: 'hide'
  }, 350);
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
