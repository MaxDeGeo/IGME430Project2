const handleError = (fields) => {
  for (let i = 0; i < fields.failures.length; i++) {
    if (fields.failures[i]) {
      document.querySelector(fields.ids[i]).style.borderColor = '#ff0000';
    } else {
      document.querySelector(fields.ids[i]).style.borderColor = '#b1b1b1a2';
    }
  }
};

const redirect = (response) => {
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type,
    url: action,
    data,
    dataType: 'json',
    success,
    error(xhr, status, error) {
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    },
  });
};

const openForm = (id) => {
  document.querySelector(id).style.visibility = 'visible';
  document.querySelector(id).style.opacity = 1;
};

const closeForm = (id) => {
  document.querySelector(id).style.visibility = 'hidden';
  document.querySelector(id).style.opacity = 0;
};

const hasText = () => {
  const box = document.querySelector('.messageBox');
  return true;
  // return box.textContent && box.textContent.trim.length > 0;
};

const clearChat = () => {
  const box = document.querySelector('.messageBox');
  box.value = '';
};

const displayChat = (e) => {
  const leftBar = document.querySelector('#leftBar');
  const mainContent = document.querySelector('#activeChat');
  const chatNames = document.querySelectorAll('.chatTextSec');
  const inputSection = document.querySelector('#inputSection');
  const profileFooter = document.querySelector('.footerProfileName');
  const profileImage = document.querySelector('.footerProfileImg');
  const addButton = document.querySelector('.addButtonIco');

  if (leftBar.style.width === '73px') {
    leftBar.style.width = 'calc(20% - 1px)';
    mainContent.style.width = 'calc(60% - 2px)';
    inputSection.style.width = 'calc(60% - 3px)';
    e.target.parentElement.style.textAlign = 'right';

    for (let i = 0; i < chatNames.length; i++) {
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

    for (let i = 0; i < chatNames.length; i++) {
      chatNames[i].style.display = 'none';
    }

    profileFooter.style.display = 'none';
    profileImage.style.marginLeft = '16px';
    addButton.style.marginLeft = '13px';
  }
};
