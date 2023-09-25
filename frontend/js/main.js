(async () => {

  // Async

  const SERVER_URL = 'http://localhost:3000';
  const address = '/api/clients/';

  async function addClientServer(obj) {
    const btnWrapp = document.querySelector('.modal-form__btn-wrapp')
    const errorMessageElem = document.createElement('div');

    errorMessageElem.classList.add('error-message');
    try {
      let response = await fetch(SERVER_URL + address, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })


      if (response.ok) {
        let data = await response.json();
        return data;
      } else {
        let data = await response.json();

        if (response.status === 422) {
          for (const item of data.errors) {
            if (btnWrapp.firstChild.textContent.includes('Ошибка')) {
              btnWrapp.firstChild.remove();
            }
            errorMessageElem.textContent = `Ошибка ${response.status}: ${item.message}`
          }
        } else if (response.status === 404) {
          if (btnWrapp.firstChild.textContent.includes('Ошибка')) {
            btnWrapp.firstChild.remove();
          }
          errorMessageElem.innerHTML = `Ошибка ${response.status}: ${data.message} <br> Не найдено`;
        }
      }
      btnWrapp.prepend(errorMessageElem);
    } catch {
      errorMessageElem.textContent = 'Что-то пошло не так...';
      btnWrapp.prepend(errorMessageElem);
    }
  }


  async function getClientsListServer() {
    const container = document.querySelector('.main-container');
    const errorMessageElem = document.createElement('div');

    errorMessageElem.classList.add('error-message');
    try {
      let response = await fetch(SERVER_URL + address, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        let data = await response.json();
        return data;
      } else {
        let data = await response.json();
          errorMessageElem.innerHTML = `Ошибка ${response.status}: ${data.message}`;
      }
      container.prepend(errorMessageElem);
    } catch {
      errorMessageElem.textContent = 'Что-то пошло не так...';
      container.prepend(errorMessageElem);
    }
  }


  async function deleteClientServer(id) {
    const modalDelWrapp = document.getElementById('modal-content');
    const errorMessageElem = document.createElement('div');

    errorMessageElem.classList.add('error-message');
    try {
      let response = await fetch(SERVER_URL + address + id, {
        method: "DELETE",
      })
      if (response.ok) {
        let data = await response.json();
        return data;
      } else {
        let data = await response.json();
          errorMessageElem.innerHTML = `Ошибка ${response.status}: ${data.message} <br> Не найдено`;
      }
      modalDelWrapp.prepend(errorMessageElem);
    } catch {
      errorMessageElem.textContent = 'Что-то пошло не так...';
      modalDelWrapp.prepend(errorMessageElem);
    }
  }

  async function changeClientServer(id, obj) {
    const btnWrapp = document.querySelector('.modal-form__btn-wrapp');
    const errorMessageElem = document.createElement('div');

    errorMessageElem.classList.add('error-message');
    try {
      let response = await fetch(SERVER_URL + address + id, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      })
      if (response.ok) {
        let data = await response.json();
        return data;
      } else {
        let data = await response.json();

        if (response.status === 422) {
          for (const item of data.errors) {
            if (btnWrapp.firstChild.textContent.includes('Ошибка')) {
              btnWrapp.firstChild.remove();
            }
            errorMessageElem.textContent = `Ошибка ${response.status}: ${item.message}`
          }
        } else if (response.status === 404) {
          if (btnWrapp.firstChild.textContent.includes('Ошибка')) {
            btnWrapp.firstChild.remove();
          }
          errorMessageElem.innerHTML = `Ошибка ${response.status}: ${data.message} <br> Не найдено`;
        }
      }
      btnWrapp.prepend(errorMessageElem);
    } catch {
      errorMessageElem.textContent = 'Что-то пошло не так...';
      btnWrapp.prepend(errorMessageElem);
    }
  }

  async function searchClientsServer(str) {
    let response = await fetch(SERVER_URL + address + '?search=' + str, {
      method: "GET",
      headers: {'Content-Type': 'application/json'}
    })

    let data = await response.json();

    data.forEach(item => {
      item.fio = item.surname + ' ' + item.name + ' ' + item.lastName;
    })

    const filtredData = data.filter(x => x.fio.toLowerCase().includes(str.toLowerCase()));

    return filtredData;
  }

  function showAutocompliteData(clients) {
    const autocompliteUl = document.getElementById('clients-list');
    const tdFio = document.querySelectorAll('td[class="fio-td"]');

    
    if (clients) {
      autocompliteUl.innerHTML = '';
      clients.forEach(item => {
        const linkEl = document.createElement('a');
        const liElem = document.createElement('li');
        liElem.classList.add('autocomplite__item');
        linkEl.textContent =  `${item.surname} ${item.name} ${item.lastName}`;
        liElem.append(linkEl);
        autocompliteUl.append(liElem);

        liElem.addEventListener('click', (e) => {
          e.preventDefault();
          const clientFio = e.target.textContent;

          tdFio.forEach(item => {
            if (item.textContent == clientFio) {
              e.target.setAttribute('href', `#${item.parentElement.id}`);
              item.parentElement.style.outline = '1px solid rgb(152, 115, 255)';
              item.parentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
            } else item.parentElement.style.outline = 'none';
          })
        })
      })
    }

    return autocompliteUl;
  }


  const clientsList = await getClientsListServer();
  let clientsListCopy = [...clientsList];

  // Поиск
  
  function searchClients () {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    let time;

    searchForm.addEventListener('input', async (e) => {
      e.preventDefault();
      clearTimeout(time);
      let inp = async function () {
        const searchDataValue = await searchClientsServer(searchInput.value.trim());
        const autocompliteFunc = showAutocompliteData(searchDataValue);
        if (!searchInput.value) {
          autocompliteFunc.innerHTML = '';
          clearTimeout(time);
        }
      };
      time = setTimeout(inp, 300);
    })

  }

  // Элементы таблицы
  function createTableElements() {
    const app = document.getElementById('app');
    const table = document.createElement('table');
    const tHead = document.createElement('thead');
    const tBody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const thId = document.createElement('th');
    const btnId = document.createElement('button');
    const thFIO = document.createElement('th');
    const fioBtn = document.createElement('button');
    const purpleSpan = document.createElement('span');
    const thDateCreation = document.createElement('th');
    const dateCreationBtn = document.createElement('button');
    const thLastChanges = document.createElement('th');
    const lastChangesBtn = document.createElement('button');
    const thContacts = document.createElement('th');
    const thChanges = document.createElement('th');
    const thDelete = document.createElement('th');
    const clientAddButton = document.createElement('button');
  
    thId.setAttribute('id', 'id');
    thId.setAttribute('aria-label', 'Колонка "Id", кнопка');
    thId.classList.add('column-id')
    thFIO.setAttribute('id', 'FIO');
    thFIO.setAttribute('aria-label', 'Колонка "FIO", кнопка');
    thFIO.classList.add('column-fio');
    purpleSpan.style.color = '#9873FF';
    purpleSpan.style.fontSize = '12px';
    purpleSpan.textContent = ' А-Я';
    thDateCreation.setAttribute('id', 'createdAt');
    thDateCreation.setAttribute('aria-label', 'Колонка "Дата Создания", кнопка');
    thDateCreation.classList.add('column-createdAt');
    thLastChanges.setAttribute('id', 'updatedAt');
    thLastChanges.setAttribute('aria-label', 'Колонка "Последние изменения", кнопка');
    thLastChanges.classList.add('column-updatedAt');
    thContacts.textContent = 'Контакты';
    thChanges.textContent = 'Действия';
    clientAddButton.textContent = 'Добавить клиента';
    clientAddButton.setAttribute('id', 'client-button');
    clientAddButton.setAttribute('aria-label', 'Кнопка "Добавить клиента"');
    clientAddButton.classList.add('btn-reset', 'clients-btn');
    btnId.setAttribute('type', 'button');
    lastChangesBtn.setAttribute('type', 'button');
    dateCreationBtn.setAttribute('type', 'button');
    fioBtn.setAttribute('type', 'button');
  
    
    btnId.classList.add('btn-id' ,'btn-reset');
    lastChangesBtn.classList.add('btn-changes' ,'btn-reset');
    dateCreationBtn.classList.add('btn-creation' ,'btn-reset');
    fioBtn.classList.add('btn-fio' ,'btn-reset');
    btnId.textContent = 'ID';
    fioBtn.textContent = 'Фамилия Имя Отчество';
    lastChangesBtn.textContent = 'Последние изменения';
    dateCreationBtn.textContent = 'Дата и время создания';
    thId.append(btnId)
    thFIO.append(purpleSpan);
    thFIO.prepend(fioBtn);
    thLastChanges.append(lastChangesBtn);
    thDateCreation.append(dateCreationBtn);
    tr.append(thId, thFIO, thDateCreation, thLastChanges, thContacts, thChanges, thDelete);
    tHead.append(tr);
    table.append(tHead);
    table.append(tBody);
    app.append(table);
    app.append(clientAddButton);

    // Кликеры сортировки

    thId.addEventListener('click', onClickSortClientsList);

    thFIO.addEventListener('click', onClickSortClientsList);

    thDateCreation.addEventListener('click', onClickSortClientsList);

    thLastChanges.addEventListener('click', onClickSortClientsList);

    // Кликеp Добавления нового клиента

    clientAddButton.addEventListener('click', () => createModalWindowNewClient());

    return app;
  }

  // Отрисовка

  function showClient(obj) {
    const clientTr = document.createElement('tr');
    const clientId = document.createElement('td');
    const clientFIO = document.createElement('td');
    const updateGreySpan = document.createElement('span');
    const creationGreySpan = document.createElement('span');
    const clientDateOfCreation = document.createElement('td');
    const clientDateChanges = document.createElement('td');
    const clientContacts = document.createElement('td');
    const iconWrapp = document.createElement('ul');
    const clientActions = document.createElement('button');
    const clientDeleteTd = document.createElement('button');

    clientActions.classList.add('actions', 'btn-reset', 'action-btns');
    clientActions.setAttribute('aria-label', 'Изменить');
    clientDeleteTd.setAttribute('id', 'delete');
    clientDeleteTd.setAttribute('aria-label', 'Удалить');
    clientDeleteTd.classList.add('delete-btn', 'btn-reset', 'action-btns');
    iconWrapp.classList.add('icons-list');
    clientId.setAttribute('id', 'number-of-id');
    clientId.setAttribute('aria-label', 'Номера Id клиентов');
    clientId.classList.add('id-number');
    clientFIO.classList.add('fio-td')
    clientFIO.setAttribute('aria-label', 'ФИО клиента');
    clientDateOfCreation.setAttribute('aria-label', 'Дата и время создания клиента');
    clientDateChanges.setAttribute('aria-label', 'Последние изменения');
    clientContacts.setAttribute('aria-label', 'Список Контактов');
    creationGreySpan.textContent = `  ${new Date(obj.createdAt).getHours()}.${new Date(obj.createdAt).getMinutes()}`
    updateGreySpan.textContent = `  ${new Date(obj.updatedAt).getHours()}:${new Date(obj.updatedAt).getMinutes()}`;
    creationGreySpan.style.color = '#B0B0B0';
    updateGreySpan.style.color = '#B0B0B0';

    obj.FIO = obj.surname + ' ' + obj.name + ' ' + obj.lastName;
    clientId.textContent = obj.id;
    clientFIO.textContent = obj.FIO;
    clientDateOfCreation.textContent = `${new Date(obj.createdAt).getDate() < 10 ? '0' + new Date(obj.createdAt).getDate(): new Date(obj.createdAt).getDate()}.${new Date(obj.createdAt).getMonth() < 10 ? '0' + new Date(obj.createdAt).getMonth() : new Date(obj.createdAt).getMonth()}.${new Date(obj.createdAt).getFullYear()}`;
    clientDateChanges.textContent = `${new Date(obj.updatedAt).getDate() < 10 ? '0' + new Date(obj.updatedAt).getDate() : new Date(obj.updatedAt).getDate()}.${new Date(obj.updatedAt).getMonth() < 10 ? '0' + new Date(obj.updatedAt).getMonth() : new Date(obj.updatedAt).getMonth()}.${new Date(obj.updatedAt).getFullYear()}`;
    clientActions.textContent = 'Изменить';
    clientDeleteTd.textContent = 'Удалить';


    clientDateOfCreation.append(creationGreySpan);
    clientDateChanges.append(updateGreySpan);
    clientTr.setAttribute('id', `${obj.id}`);
    clientTr.append(clientId, clientFIO, clientDateOfCreation, clientDateChanges, clientContacts, clientActions, clientDeleteTd);
    clientContacts.append(iconWrapp);

    clientActions.addEventListener('click', (e) => createModalWindowChange(e));

    clientDeleteTd.addEventListener('click', (e) =>  createModalWindowDelete(e));

    // Условие проверки на наличие контактов

    const circleIcon = document.createElement('button');

    circleIcon.classList.add('circle-icon', 'btn-reset');

    for (let item of obj.contacts) {
      if (item.type === 'Email' && item.value) {
        const mailIcon = document.createElement('img');
        const tooltipMail = document.createElement('li');
        const tooltipTextMail = document.createElement('span');

        mailIcon.setAttribute('src', 'img/mail.svg');
        mailIcon.setAttribute('aria-label', 'Иконка "Имэйл"');
        mailIcon.classList.add('contacts-icon');
        tooltipMail.classList.add('icons-list__elem');
        tooltipTextMail.classList.add('icons-list__tooltip-text');
        tooltipMail.append(tooltipTextMail, mailIcon);
        iconWrapp.append(tooltipMail);
        tooltipMail.firstElementChild.textContent = `${item.type}: ${item.value}`;
      }

      if (item.type === 'Телефон' && item.value) {
        const phoneIcon = document.createElement('img');
        const tooltipPhone = document.createElement('li');
        const tooltipTextPhone = document.createElement('span');

        phoneIcon.setAttribute('src', 'img/phone.svg');
        phoneIcon.classList.add('contacts-icon');
        tooltipPhone.classList.add('icons-list__elem');
        tooltipTextPhone.classList.add('icons-list__tooltip-text');
        tooltipPhone.append(tooltipTextPhone, phoneIcon);
        iconWrapp.append(tooltipPhone);
        tooltipPhone.firstElementChild.textContent = `${item.type}: ${item.value}`;
      }

      if (item.type === 'Vk' && item.value) {
        const vkIcon = document.createElement('img');
        const tooltipVk = document.createElement('li');
        const tooltipTextVk = document.createElement('span');

        vkIcon.setAttribute('src', 'img/vk.svg');
        vkIcon.classList.add('contacts-icon');
        tooltipVk.classList.add('icons-list__elem');
        tooltipTextVk.classList.add('icons-list__tooltip-text');
        tooltipVk.append(tooltipTextVk, vkIcon);
        iconWrapp.append(tooltipVk);
        tooltipVk.firstElementChild.textContent = `${item.type}: ${item.value}`;
      }

      if (item.type === 'Facebook' && item.value) {
        const fbIcon = document.createElement('img');
        const tooltipFb = document.createElement('li');
        const tooltipTextFb = document.createElement('span');

        fbIcon.setAttribute('src', 'img/fb.svg');
        fbIcon.classList.add('contacts-icon');
        tooltipFb.classList.add('icons-list__elem');
        tooltipTextFb.classList.add('icons-list__tooltip-text');
        tooltipFb.append(tooltipTextFb, fbIcon);
        iconWrapp.append(tooltipFb);
        tooltipFb.firstElementChild.textContent = `${item.type}: ${item.value}`;
      }

      if (item.type === 'Другое' && item.value) {
        const subIcon = document.createElement('img');
        const tooltipSub = document.createElement('li');
        const tooltipTextSub = document.createElement('span');

        subIcon.setAttribute('src', 'img/Subtract.svg');
        subIcon.classList.add('contacts-icon');
        tooltipSub.classList.add('icons-list__elem');
        tooltipTextSub.classList.add('icons-list__tooltip-text');
        tooltipSub.append(tooltipTextSub, subIcon);
        iconWrapp.append(tooltipSub);
        tooltipSub.firstElementChild.textContent = `${item.type}: ${item.value}`;
      }
    }
    
    if (obj.contacts.length > 5) {
      iconWrapp.children[4].style.display = 'none';
      circleIcon.textContent = `+${obj.contacts.length - 4}`;
      iconWrapp.append(circleIcon);
    }

    circleIcon.addEventListener('click', () => {
      for (let i = 4; i < iconWrapp.childElementCount; i++) {
        iconWrapp.children[i].style.display = 'block'
      }
      circleIcon.style.display = 'none';
      clientContacts.style.width = '12%';
    })
    
    return clientTr;
  }

  function getClients(arr) {
    const tBodyElem = document.querySelector('tBody');
    for (let obj of arr) {
      const newClient = showClient(obj);
      tBodyElem.append(newClient);
    }
  }


  function createModalWindow() {
    const main = document.querySelector('.main-container')
    const modalWindow = document.createElement('div');
    const modalCloseArea = document.createElement('a');
    const modalWrapp = document.createElement('div');
    const modalTitle = document.createElement('div');
    const modalClose = document.createElement('a');
    const modalContent = document.createElement('div');
    const modalForm = document.createElement('form');
    const modalSurNameLabel = document.createElement('label');
    const modalNameLabel = document.createElement('label');
    const modalLastNameLabel = document.createElement('label');
    const modalInpName = document.createElement('input');
    const modalInpSurName = document.createElement('input');
    const modalInpLastName = document.createElement('input');
    const modalNewContactsIcon = document.createElement('img');
    const modalBtnNewContact = document.createElement('button');
    const accordion = document.createElement('div');
    const accordionHeader = document.createElement('div');
    const accordionBody = document.createElement('div');
    const modalBtnWrapp = document.createElement('div');
    const modalBtnSave = document.createElement('button');
    const modalBtnChange = document.createElement('button');
    const modalBtnCansel = document.createElement('button');
    const modalBtnDeleteClient = document.createElement('button');
    const modalQuestionDeleteText = document.createElement('div');

    modalWindow.setAttribute('id', 'modal');
    modalWindow.setAttribute('aria-label', 'Всплывающее окно');
    modalWindow.classList.add('modal');
    modalCloseArea.classList.add('modal__area', 'modal-close');
    modalCloseArea.setAttribute('href', '#');
    modalClose.setAttribute('id', 'close');
    modalClose.setAttribute('href', '#');
    modalClose.classList.add('modal__close-btn', 'modal-close');
    modalClose.textContent = 'X';
    modalWrapp.classList.add('modal__wrapp');
    modalTitle.setAttribute('id', 'modalTitle');
    modalTitle.classList.add('modal__title');
    modalContent.setAttribute('id', 'modal-content');
    modalContent.classList.add('modal__content');
    modalForm.setAttribute('id', 'modal-form');
    modalForm.classList.add('modal-form');
    modalSurNameLabel.setAttribute('for', 'modal-input_surname');
    modalSurNameLabel.classList.add('label');
    modalNameLabel.setAttribute('for', 'modal-input_name');
    modalNameLabel.classList.add('label');
    modalLastNameLabel.setAttribute('for', 'modal-input_lastname');
    modalLastNameLabel.classList.add('label');
    modalInpName.setAttribute('id', 'modal-input_name');
    modalInpName.setAttribute('type', 'text');
    modalInpName.setAttribute('name', 'name');
    modalInpName.classList.add('modal-form__input', 'modal-form__input_name');
    modalInpName.setAttribute('placeholder', 'Имя*');
    modalInpSurName.setAttribute('id', 'modal-input_surname');
    modalInpSurName.setAttribute('type', 'text');
    modalInpSurName.setAttribute('name', 'surname');
    modalInpSurName.classList.add('modal-form__input', 'modal-form__input_surname');
    modalInpSurName.setAttribute('placeholder', 'Фамилия*');
    modalInpLastName.setAttribute('id', 'modal-input_lastname');
    modalInpLastName.setAttribute('type', 'text');
    modalInpLastName.setAttribute('name', 'lastname');
    modalInpLastName.classList.add('modal-form__input', 'modal-form__input_lastname');
    modalInpLastName.setAttribute('placeholder', 'Отчество*');
    modalNewContactsIcon.setAttribute('src', 'img/newContact.svg');
    modalNewContactsIcon.classList.add('newContact-icon');
    modalBtnNewContact.setAttribute('id', 'modal_btn_newContact');
    modalBtnNewContact.classList.add('modal-form__btn', 'btn-reset');
    accordion.classList.add('accordion');
    accordionHeader.classList.add('accordion__header');
    accordionBody.classList.add('accordion__body');
    modalBtnCansel.setAttribute('id', 'btn_cansel');
    modalBtnCansel.classList.add('modal-form__btn_underline', 'btn-reset');
    modalBtnWrapp.classList.add('modal-form__btn-wrapp');
    modalBtnSave.setAttribute('id', 'btn_save');
    modalBtnSave.setAttribute('type', 'submit');
    modalBtnSave.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnSave.textContent = 'Сохранить';
    modalBtnDeleteClient.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnDeleteClient.setAttribute('id', 'btn-delete');
    modalBtnChange.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnChange.setAttribute('id', 'btn_change');
    modalBtnChange.setAttribute('type', 'submit');
    modalQuestionDeleteText.setAttribute('aria-label', 'Вопрос');
    modalQuestionDeleteText.classList.add('modal__question');

    modalBtnNewContact.textContent = 'Добавить контакт';
    accordionBody.append(modalBtnNewContact);
    accordionBody.append(modalNewContactsIcon);
    accordion.append(accordionHeader, accordionBody);
    modalNameLabel.append(modalInpName);
    modalSurNameLabel.append(modalInpSurName);
    modalLastNameLabel.append(modalInpLastName);
    modalBtnWrapp.append(modalBtnSave, modalBtnCansel, modalBtnDeleteClient, modalBtnChange)
    modalForm.append(modalSurNameLabel, modalNameLabel, modalLastNameLabel, accordion, modalBtnWrapp);
    modalContent.append(modalClose, modalTitle, modalForm);
    modalWrapp.append(modalContent);
    modalWindow.append(modalCloseArea, modalWrapp);
    main.append(modalWindow);

    modalBtnNewContact.addEventListener('click', (e) => {
      e.preventDefault();
      const contactsForm = contactsFormDisplay();
      accordionHeader.classList.add('accordion__header_active');
      accordionHeader.append(contactsForm.contactForm.contactsForm);
      accordionHeader.childElementCount === 10 ? accordion.lastChild.style.display = 'none' : 0;
    })

    modalBtnCansel.addEventListener('click', () => {
      modalWindow.remove();
    })

    document.querySelectorAll('.modal-close').forEach(area => {
      area.addEventListener('click', () => {
        modalWindow.remove();
      })
    })


    return {
      modalWindow,
      modalContent,
      modalTitle,
      modalForm,
      modalInpName,
      modalInpSurName,
      modalInpLastName,
      modalBtnWrapp,
      modalBtnSave,
      modalBtnChange,
      modalBtnCansel,
      modalQuestionDeleteText,
      modalBtnDeleteClient,
      modalBtnNewContact,
      accordion,
      accordionHeader,
      accordionBody
    }
  }


  function validator() {

    const validation = new JustValidate('#modal-form');

    validation
    .addField('#modal-input_surname', [
      {
        rule: 'minLength',
        value: 1,
        errorMessage: 'Фамилия слишком короткая'
      },
      {
        rule: 'maxLength',
        value: 40
      },
      {
        rule: 'required',
        errorMessage: 'Введите фамилию'
      }
    ])

    validation
      .addField('#modal-input_name', [
        {
          rule: 'minLength',
          value: 3,
          errorMessage: 'Имя слишком короткое'
        },
        {
          rule: 'maxLength',
          value: 30,
        },
        {
            rule: 'required',
            errorMessage: 'Введите имя',
          },
      ])
      
      return validation;
  }

  // Функция создания модального окна нового клиента

  function createModalWindowNewClient() {
    const modal = createModalWindow()
    const validation = validator();
    modal.modalTitle.textContent = 'Новый клиент';
    modal.modalBtnChange.style.display = 'none';
    modal.modalForm.style.display = 'flex';
    modal.modalBtnSave.style.display = 'block'
    modal.modalBtnCansel.textContent = 'Отмена';
    modal.modalWindow.classList.add('modal-active');
    modal.modalBtnDeleteClient.style.display = 'none';
    modal.modalBtnWrapp.append(modal.modalBtnCansel);


    // Отправка Данных формы на сервер

    modal.modalForm.addEventListener('submit', async function () {
      if (validation.isValid) {
        if (await addClientServer(getDataForm(modal))) {
          modal.modalInpName.value = '';
          modal.modalInpSurName.value = '';
          modal.modalInpLastName.value = '';
          modal.modalWindow.classList.remove('modal-active');
          location.reload();
        }
      }
    })

    return modal.modalForm;
  }

  // Функция создания модального окна изменения данных клиента

  function createModalWindowChange(event) {
    const modal = createModalWindow();
    const validation = validator();
    modal.modalTitle.textContent = `Изменить данные  ID: ${event.target.parentElement.id}`;
    modal.modalQuestionDeleteText.style.display = 'none';
    modal.modalBtnSave.style.display = 'none';
    modal.modalForm.style.display = 'flex';
    modal.modalBtnChange.style.display = 'block';
    modal.modalBtnDeleteClient.style.display = 'block';
    modal.modalBtnDeleteClient.classList.remove('modal-form__btn_purple');
    modal.modalBtnDeleteClient.classList.add('modal-form__btn_underline');
    modal.modalBtnDeleteClient.textContent = 'Удалить клиента';
    modal.modalBtnChange.textContent = 'Сохранить';
    modal.modalBtnWrapp.append(modal.modalBtnChange, modal.modalBtnDeleteClient);
    modal.modalWindow.classList.add('modal-active');
    modal.accordion.prepend(modal.accordionHeader);
    modal.accordionHeader.classList.add('accordion__header_active');
    modal.modalWindow.style.display = 'block';
    // Заполнение инпутов
    for (let obj of clientsListCopy) {
      if (obj.id.includes(event.target.parentElement.id)) {
        modal.modalInpSurName.value = obj.surname;
        modal.modalInpName.value = obj.name;
        modal.modalInpLastName.value = obj.lastName;
        obj.contacts.forEach(el => {
          const createContactsForm = contactsFormDisplay();
          modal.accordionHeader.append(createContactsForm.contactForm.contactsForm);
          createContactsForm.contactForm.contactInp.value = el.value;
          const btnDeleteContact = document.querySelectorAll('.delete-inp');
          btnDeleteContact.forEach(btn => {
            btn.style.display = 'flex';
          })
          if (el.type === 'Телефон') {
            createContactsForm.contactForm.contactInp.setAttribute('type', 'tel');
            createContactsForm.contactForm.contactInp.setAttribute('id', 'tel');
            const im = new Inputmask ("+7 (999)-999-99-99");
            
            im.mask(createContactsForm.contactForm.contactInp);
          }
          createContactsForm.choices.setChoiceByValue(el.type)
        })
        
        // Изменение данных
        modal.modalForm.addEventListener('submit', async function () {
            if (validation.isValid) {
              if (await changeClientServer(obj.id, getDataForm(modal))) {
                modal.modalWindow.classList.remove('modal-active');
                location.reload();
              }
            }
        })

        // Удаление клиента
        modal.modalBtnDeleteClient.addEventListener('click', async function () {
          if (await deleteClientServer(obj.id)) {
            modal.modalWindow.classList.remove('modal-active');
            location.reload();
          }
        })
      }
    }
    modal.accordionHeader.childElementCount === 10 ? modal.accordion.lastChild.style.display = 'none' : 0;
  }

  // Функция создания модального окна удаления клиента

  function createModalWindowDelete(event) {
    const modal = createModalWindow()
    for (let obj of clientsListCopy) {
      if (obj.id.includes(event.target.parentElement.id)) {
        modal.modalTitle.textContent = 'Удалить клиента';
        modal.modalForm.style.display = 'none';
        modal.modalQuestionDeleteText.style.display = 'block';
        modal.modalQuestionDeleteText.textContent = 'Вы действительно хотите удалить данного клиента?';
        modal.modalBtnDeleteClient.style.display = 'block';
        modal.modalBtnDeleteClient.classList.remove('modal-form__btn_underline');
        modal.modalBtnDeleteClient.classList.add('modal-form__btn_purple');
        modal.modalBtnDeleteClient.textContent = 'Удалить клиента';
        modal.modalBtnCansel.textContent = 'Отмена';

        modal.modalContent.append(modal.modalQuestionDeleteText, modal.modalBtnDeleteClient, modal.modalBtnCansel);

        modal.modalWindow.classList.add('modal-active');
        modal.modalWindow.style.display = 'block';

        modal.modalBtnDeleteClient.addEventListener('click', async function () {
          if (await deleteClientServer(obj.id)) {
            modal.modalWindow.classList.remove('modal-active');
            location.reload();
          }
        })
      }
    }
  }

  function createContactForm() {
    const contactsForm = document.createElement('form');
    const contactSelect = document.createElement('select');
    const contactOptionTel = document.createElement('option');
    const contactOptionMail = document.createElement('option');
    const contactOptionVk = document.createElement('option');
    const contactOptionFb = document.createElement('option');
    const contactOptionOther = document.createElement('option');
    const contactInp = document.createElement('input');
    const contactBtnNewContact = document.getElementById('modal_btn_newContact');
    const contactBtnDelete = document.createElement('button');
    const contactBtnCircle = document.createElement('div');
    const contactBtnLineOne = document.createElement('span');
    const contactBtnLineTwo = document.createElement('span');

    contactSelect.setAttribute('name', 'contact');
    contactSelect.setAttribute('id', 'contacts-select');
    contactOptionTel.setAttribute('value', 'Телефон');
    contactOptionMail.setAttribute('value', 'Email');
    contactOptionVk.setAttribute('value', 'Vk');
    contactOptionFb.setAttribute('value', 'Facebook');
    contactOptionOther.setAttribute('value', 'Другое');
    contactOptionTel.textContent = 'Телефон';
    contactOptionMail.textContent = 'Email';
    contactOptionFb.textContent = 'Facebook';
    contactOptionVk.textContent = 'Vk';
    contactOptionOther.textContent = 'Другое';



    contactInp.setAttribute('type', 'email');
    contactInp.setAttribute('placeholder', 'Введите данные контакта');

    contactInp.classList.add('accordion__input');
    contactsForm.classList.add('contacts-wrapp');
    contactBtnDelete.classList.add('delete-inp');
    contactBtnCircle.classList.add('delete-inp__circle');
    contactBtnLineOne.classList.add('delete-inp__line');
    contactBtnLineTwo.classList.add('delete-inp__line');

    contactBtnCircle.append(contactBtnLineOne, contactBtnLineTwo);
    contactBtnDelete.append(contactBtnCircle);
    contactBtnDelete.style.display = 'none';
    contactSelect.append(contactOptionMail, contactOptionTel, contactOptionVk, contactOptionFb, contactOptionOther);
    contactsForm.append(contactSelect, contactInp, contactBtnDelete);
    

    return {
      contactSelect,
      contactsForm,
      contactInp,
      contactBtnDelete,
      contactBtnNewContact
    }
  }

  // Отображение формы контактов

  function contactsFormDisplay() {
    const contactForm = createContactForm();
    const choices = new Choices(contactForm.contactSelect, {
      searchEnabled: false,
      shouldSort: false,
      placeholder: true,
      itemSelectText: '',
      allowHTML: true
    });

    contactForm.contactSelect.addEventListener('change', () => {
      const getValue = contactForm.contactSelect.value;
      if (getValue === 'Телефон') {
        contactForm.contactInp.value = '';
        contactForm.contactInp.setAttribute('type', 'tel');
        contactForm.contactInp.setAttribute('id', 'tel');
        /* Mask */
        const im = new Inputmask ("+7 (999)-999-99-99");

        im.mask(contactForm.contactInp);
      }
      else if (getValue === 'Email') {
        contactForm.contactInp.value = '';
        contactForm.contactInp.setAttribute('type', 'Email');
        contactForm.contactInp.setAttribute('id', 'Email');
        /* Mask */
        Inputmask.remove(contactForm.contactInp);
      } else if (getValue === 'Vk') {
        contactForm.contactInp.value = '';
        contactForm.contactInp.setAttribute('type', 'text');
        contactForm.contactInp.setAttribute('id', 'Vk');
        /* Mask */
        Inputmask.remove(contactForm.contactInp);
      } else if (getValue === 'Facebook') {
        contactForm.contactInp.value = '';
        contactForm.contactInp.setAttribute('type', 'text');
        contactForm.contactInp.setAttribute('id', 'Facebook');
        /* Mask */
        Inputmask.remove(contactForm.contactInp);
      } else {
        contactForm.contactInp.value = '';
        contactForm.contactInp.setAttribute('type', 'text');
        contactForm.contactInp.setAttribute('id', 'Other');
        /* Mask */
        Inputmask.remove(contactForm.contactInp);
      }
    })


    contactForm.contactInp.addEventListener('input', () => {
      if (contactForm.contactInp.value) {
        contactForm.contactBtnDelete.style.display = 'flex';
      } else contactForm.contactBtnDelete.style.display = 'none';
    })

    contactForm.contactBtnDelete.addEventListener('click', () => {
      contactForm.contactInp.value = '';
      contactForm.contactsForm.remove();
      document.querySelector('.accordion__header').childElementCount < 10 ? document.querySelector('.accordion__body').style.display = 'block' : 0;
    })

    if (contactForm.contactSelect.value === 'Телефон') {
      contactForm.contactInp.setAttribute('id', 'tel');
    }
    else if (contactForm.contactSelect.value === 'Email') {
      contactForm.contactInp.setAttribute('id', 'email');
    }


    return {
      contactForm,
      choices
    }
  }

  // Функция сортировки

  const sortClientsList = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0);


// Функция сбора данных с формы

  function getDataForm(func) {
    let typeData = [];
    let valueData = [];
    for (let input of document.querySelectorAll('.accordion__input')) {
      if (!input.value.trim()) {
        input.previousElementSibling.firstChild.firstChild.value = ''
      } else {
        valueData.push(input.value.trim())
      }
    }
    for (let select of document.querySelectorAll('#contacts-select')) {
      if (select.value.trim()) {
        typeData.push(select.value.trim());
      }
    }
    
    const newClient = {
      name: (func.modalInpName.value.trim().charAt(0).toUpperCase() + func.modalInpName.value.trim().slice(1).toLowerCase()),
      surname: (func.modalInpSurName.value.trim().charAt(0).toUpperCase() + func.modalInpSurName.value.trim().slice(1).toLowerCase()),
      lastName: (func.modalInpLastName.value.trim().charAt(0).toUpperCase() + func.modalInpLastName.value.trim().slice(1).toLowerCase()),
      contacts: [],
      updatedAt: new Date(),
      createdAt: new Date()
    }

    for (let i = 0; i < valueData.length; i++) {
      let newContact = {};
      newContact.type = typeData[i];
      newContact.value = valueData[i];
      newClient.contacts.push(newContact);
    }

    return newClient;
  }

  // Функция сортировки события "Click"
  let sortDir = false;

  function onClickSortClientsList () {
    const tBodyElem = document.querySelector('tBody');
    sortDir = !sortDir;
    sortClientsList(clientsListCopy, this.id, sortDir);
    tBodyElem.innerHTML = "";
    this.classList.toggle('arrow-down');
    getClients(clientsListCopy);
  }


  createTableElements();

  getClients(clientsListCopy);

  searchClients()
  
  
})();