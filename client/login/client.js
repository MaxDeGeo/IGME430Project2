const handleLogin = (e) => {
  e.preventDefault();

  const fields = {
    ids: ["#user", "#pass"],
    failures: [false, false],
  }

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
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  const fields = {
    ids: ["#user", "#email", "#email2", "#pass", "#pass2"],
    failures: [false, false, false, false, false],
  }

  document.querySelector("#userError").style.display = "none";
  document.querySelector("#email2Error").style.display = "none";
  document.querySelector("#pass2Error").style.display = "none";


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

const handlePasswordChange = (e) => {
  e.preventDefault();

  //UPDATE TO NEW FORM VALIDATION

  const fields = {
    ids: ["#current", "#newPass", "#newPass2"],
    failures: [false, false, false],
  }
  
  document.querySelector("#newPass2Error").style.display = "none";

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

  if ($("#newPass").val() !== $("#newPass2").val()) {
    fields.failures[2] = true;
    handleError(fields);
    document.querySelector("#newPass2Error").style.display = "block";
    return false;
  }

  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

  return false;
};

const LoginWindow = (props) => {
  return (
    <form id="loginForm"
      className="formBody"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST">
        <h2 className="formTitle">Login</h2>
        <div className="inputError" id="loginError">Username and/or password are wrong.</div>
        <div className="formInput">
          <label className="labelText" htmlFor="username">Username: </label><br />
          <input className="fullInput" id="user" type="text" name="username" />
        </div>
        <div className="formInput">
          <label className="labelText" htmlFor="pass">Password: </label><br />
          <input className="fullInput" id="pass" type="password" name="pass" />
        </div>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign in" />
        <div className="subtext">
          Don't have an account? <span className="link" onClick={() => createSignupWindow(props.csrf)}>Create one now</span>.
        </div>
    </form>
  );
};

const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      className="formBody"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST">
      <h2 className="formTitle">Sign Up</h2>  
      <div className="formInput">
        <label className="labelText" htmlFor="username">Username: </label>
        <input className="fullInput" id="user" type="text" name="username" />
        <div className="inputError" id="userError">Username is already taken.</div>
      </div>
      <div className="formInput">
        <label className="labelText" htmlFor="email">Email: </label>
        <input className="fullInput" id="email" type="text" name="email" />
      </div>
      <div className="formInput">
        <label className="labelText" htmlFor="email2">Retype Email: </label>
        <input className="fullInput" id="email2" type="text" name="email2" />
        <div className="inputError" id="email2Error">Emails do not match.</div>
      </div>
      <div className="formInput">
        <label className="labelText" htmlFor="pass">Password: </label>
        <input className="fullInput" id="pass" type="password" name="pass" />
      </div>
      <div className="formInput">
        <label className="labelText" htmlFor="pass2">Retype Password: </label>
        <input className="fullInput" id="pass2" type="password" name="pass2" />
        <div className="inputError" id="pass2Error">Passwords do not match.</div>
      </div>

      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign up" />
      <div className="subtext">
          Already have an account? <span className="link" onClick={() => createLoginWindow(props.csrf)}>Login</span>.
        </div>
    </form>
  );
};

const ChangePasswordWindow = (props) => {
  return (
    <form id="passwordForm"
      className="formBody"
      name="passwordForm"
      onSubmit={handlePasswordChange}
      action="/changePassword"
      method="POST">
      <h2 className="formTitle">Change Password</h2>
      <div className="formInput">
        <label className="labelText" htmlFor="currentPassword">Current Password: </label>
        <input className="fullInput" id="current" type="password" name="current" />
      </div>
      <div className="formInput">
        <label className="labelText" htmlFor="newPass">New Password: </label>
        <input className="fullInput" id="newPass" type="password" name="newPass" />
      </div>
      <div className="formInput">
        <label className="labelText" htmlFor="newPass2">Retype New Password: </label>
        <input className="fullInput" id="newPass2" type="password" name="newPass2" />
        <div className="inputError" id="newPass2Error">Passwords do not match.</div>
      </div>

      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Update Password" /> 
    </form>
  );
};

const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createPasswordWindow = (csrf) => {
  ReactDOM.render(
    <ChangePasswordWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const setup = (csrf) => {
  const path = window.location.pathname;
  
  if (path.includes("/changePassword")) {
    createPasswordWindow(csrf);
  } else {
    createLoginWindow(csrf); // Default View
  }  
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
