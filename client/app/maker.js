const handleDomo = (e) => {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('domoHeight').val() === '' || $('domoWeight').val() === '' || $('domoEyeColor').val() === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  let serial = $('#domoForm').serialize();
  const csrf = serial.split('csrf=')[1];
  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), () => {
    loadDomosFromServer(csrf);
  });

  return false;
};

// Handles the delete call for the domo based off of unique id of domo
const handleDelete = (e, id, csrf) => {
  const domoName = e.target.parentElement.children[1].innerHTML.split(': ')[1];
  const serialize = `id=${id}&_csrf=${csrf}`
  sendAjax('DELETE', '/maker', serialize, () => {
    loadDomosFromServer(csrf);
  })
}

const DomoForm = (props) => {
  return (
    <form id="domoForm"
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm">
        <div className="formField">
          <h2 id="domoTitle">Create a Domo</h2>
          <label htmlFor="name">Name: </label>
          <input id="domoName" type="text" name="name" placeholder="Domo Name" />
        </div>
        <div className="formField">
          <label htmlFor="age">Age: </label>
          <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
        </div>
        <div className="formField">
          <label htmlFor="height">Height: </label>
          <input id="domoHeight" type="text" name="height" placeholder="Domo Height" /> 
        </div>
        <div className="formField">
          <label htmlFor="weight">Weight: </label>
          <input id="domoWeight" type="text" name="weight" placeholder="Domo Weight" />
        </div>
        <div className="formField">
          <label htmlFor="eyeColor">Eye Color: </label>
          <input id="domoEyeColor" type="text" name="eyeColor" placeholder="Domo Eye Color" />
        </div>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" name="Make Domo" />
    </form>
  )
}

const DomoList = function(props) {
  const csrf = props.csrf;
  if (props.domos.length === 0) {
    return (
      <div className="domolist">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo">
        <div className="flex">
          <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
          <h3 className="domoName">Name: {domo.name}</h3>
          <div className="delete" onClick={(e) => handleDelete(e, domo._id, props.csrf)}>x</div>
        </div>
        <div className="flex">
          <h3 className="domoAge">Age: {domo.age}</h3>
          <h3 className="domoEyeColor">Eye Color: {!domo.eyeColor ? 'N/A' : domo.eyeColor}</h3>
        </div>
        <div className="flex">
          <h3 className="domoHeight">Height: {!domo.height ? 'N/A' : domo.height}</h3>
          <h3 className="domoWeight">Weight: {!domo.weight ? 'N/A' : domo.weight}</h3>
        </div>
      </div>
    );
  });

  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = (csrf) => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} csrf={csrf} />, document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} csrf={csrf} />, document.querySelector("#domos")
  );

  loadDomosFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
