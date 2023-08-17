(async () => {

  let clientsList = [];

  // Async

  async function serverAddClient(obj) {
    try {
      let response = await fetch('http://localhost:3000' + '/api/clients', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })
  
      let data = await response.json();
  
      return data;
    } catch (error) {
      alert('Ошибка добавления');
    }
  }


  async function serverGetClientsList() {
    try {
      let response = await fetch('http://localhost:3000' + '/api/clients', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
  
      let data = await response.json();
  
      return data;
    } catch (error) {
      alert('Ошибка полученния данных')
    }
  }


  async function serverDeleteClient(id) {
    try {
      let response = await fetch('http://localhost:3000' + '/api/clients/' + id, {
        method: "DELETE",
      })
  
      let data = await response.json();
  
      return data;
    } catch (error) {
      console.log('Ошибка удаления данных');
    }
  }

  async function serverChangeClient(id, obj) {
    try {
      let response = await fetch('http://localhost:3000' + '/api/clients/' + id, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      })
  
      let data = await response.json();
  
      return data;
    } catch (error) {
      console.log('Ошибка изменения данных');
    }
  }

  async function serverSearchClients(str) {
    try {
      let response = await fetch('http://localhost:3000' + '/api/clients?search=' + str, {
        method: "GET",
        headers: {'Content-Type': 'application/json'}
      })
  
      let data = await response.json();
  
      return data;
    } catch (error) {
      console.log('Ошибка поиска данных');
    }
  }


  let serverData = await serverGetClientsList();

  if (serverData) {
    clientsList = serverData;
  }


  // Elements
  const app = document.getElementById('app');
  const table = document.createElement('table');
  const tHead = document.createElement('thead');
  const tBody = document.createElement('tbody');
  const tr = document.createElement('tr');
  const thId = document.createElement('th');
  const thFIO = document.createElement('th');
  const purpleSpan = document.createElement('span');
  const thDateCreation = document.createElement('th');
  const thLastChanges = document.createElement('th');
  const thContacts = document.createElement('th');
  const thChanges = document.createElement('th');
  const thDelete = document.createElement('th');
  const clientAddButton = document.createElement('button');


  thId.textContent = 'ID';
  thId.setAttribute('id', 'id');
  thFIO.textContent = 'Фамилия Имя Отчество';
  purpleSpan.style.color = '#9873FF';
  purpleSpan.textContent = ' А-Я';
  thFIO.setAttribute('id', 'FIO');
  thDateCreation.textContent = 'Дата и время создания';
  thDateCreation.setAttribute('id', 'createdAt')
  thLastChanges.textContent = 'Последние изменения';
  thLastChanges.setAttribute('id', 'updatedAt');
  thContacts.textContent = 'Контакты';
  thChanges.textContent = 'Действия';
  clientAddButton.textContent = 'Добавить клиента';
  clientAddButton.setAttribute('id', 'client-button');
  clientAddButton.classList.add('btn-reset', 'clients-btn');

  thFIO.append(purpleSpan);
  tr.append(thId, thFIO, thDateCreation, thLastChanges, thContacts, thChanges, thDelete);
  tHead.append(tr);
  table.append(tHead);
  table.append(tBody);
  app.append(table);
  app.append(clientAddButton);


  // Отрисовка

  function createClient(obj) {
    const contacts = createContactsIcons();
    const clientTr = document.createElement('tr');
    const clientId = document.createElement('td');
    const clientFIO = document.createElement('td');
    const updateGreySpan = document.createElement('span');
    const creationGreySpan = document.createElement('span');
    const clientDateOfCreation = document.createElement('td');
    const clientDateChanges = document.createElement('td');
    const clientContacts = document.createElement('td');
    const clientActions = document.createElement('td');
    const clientDeleteTd = document.createElement('td');

    clientActions.setAttribute('class', 'actions');
    clientDeleteTd.setAttribute('id', 'delete');
    clientId.setAttribute('id', 'number-of-id');
    creationGreySpan.textContent = `  ${new Date(obj.createdAt).getHours()}.${new Date(obj.createdAt).getMinutes()}`
    updateGreySpan.textContent = `  ${new Date(obj.updatedAt).getHours()}:${new Date(obj.updatedAt).getMinutes()}`;
    creationGreySpan.style.color = '#B0B0B0';
    updateGreySpan.style.color = '#B0B0B0';

    obj.FIO = obj.surname + ' ' + obj.name + ' ' + obj.lastName;
    clientId.textContent = obj.id;
    clientFIO.textContent = obj.FIO;
    clientDateOfCreation.textContent = `${new Date(obj.createdAt).getDate()}.${new Date(obj.createdAt).getMonth()}.${new Date(obj.createdAt).getFullYear()}`;
    clientDateChanges.textContent = `${new Date(obj.updatedAt).getDate()}.${new Date(obj.updatedAt).getMonth()}.${new Date(obj.updatedAt).getFullYear()}`;
    clientActions.textContent = 'Изменить';
    clientDeleteTd.textContent = 'Удалить';


    clientDateOfCreation.append(creationGreySpan);
    clientDateChanges.append(updateGreySpan);
    clientTr.setAttribute('id', `${obj.id}`);
    clientTr.append(clientId, clientFIO, clientDateOfCreation, clientDateChanges, clientContacts, clientActions, clientDeleteTd);

    // Условие проверки на наличие контактов

    for (let item of obj.contacts) {
      item.type === 'Телефон' && item.value ? (clientContacts.append(contacts.tooltipPhone), contacts.tooltipPhone.firstElementChild.textContent = `${item.type}: ${item.value}`) : '';
      item.type === 'Email' && item.value ? (clientContacts.append(contacts.tooltipMail), contacts.tooltipMail.firstElementChild.textContent = `${item.type}: ${item.value}`) : '';
      item.type === 'Facebook' && item.value ? (clientContacts.append(contacts.tooltipFb), contacts.tooltipFb.firstElementChild.textContent = `${item.type}: ${item.value}`) : '';
      item.type === 'Vk' && item.value ? (clientContacts.append(contacts.tooltipVk), contacts.tooltipVk.firstElementChild.textContent = `${item.type}: ${item.value}`) : '';
      item.type === 'Другое' && item.value ? (clientContacts.append(contacts.tooltipSub), contacts.tooltipSub.firstElementChild.textContent = `${item.type}: ${item.value}`) : '';
    }
    if (obj.contacts.length > 5) {
      contacts.circleIcon.textContent = `+${obj.contacts.length - 5}`;
      clientContacts.append(contacts.circleIcon);
    }

    
    
    return clientTr;
  }

  function getClients(arr) {
    for (let obj of arr) {
      const newClient = createClient(obj);
      tBody.append(newClient);
    }
  }

  // Функция отрисовки Контактов

  function createContactsIcons() {
    const vkIcon = document.createElement('img');
    const phoneIcon = document.createElement('img');
    const mailIcon = document.createElement('img');
    const fbIcon = document.createElement('img');
    const subIcon = document.createElement('img');
    const circleIcon = document.createElement('span');
    const tooltipVk = document.createElement('div');
    const tooltipPhone = document.createElement('div');
    const tooltipMail = document.createElement('div');
    const tooltipFb = document.createElement('div');
    const tooltipSub = document.createElement('div');
    const tooltipTextVk = document.createElement('span');
    const tooltipTextPhone = document.createElement('span');
    const tooltipTextMail = document.createElement('span');
    const tooltipTextFb = document.createElement('span');
    const tooltipTextSub = document.createElement('span');

    vkIcon.setAttribute('src', 'img/vk.svg');
    phoneIcon.setAttribute('src', 'img/phone.svg');
    mailIcon.setAttribute('src', 'img/mail.svg');
    fbIcon.setAttribute('src', 'img/fb.svg');
    subIcon.setAttribute('src', 'img/Subtract.svg');
    vkIcon.classList.add('contacts-icon');
    phoneIcon.classList.add('contacts-icon');
    mailIcon.classList.add('contacts-icon');
    fbIcon.classList.add('contacts-icon');
    subIcon.classList.add('contacts-icon');
    circleIcon.classList.add('circle-icon');
    tooltipVk.classList.add('tooltip');
    tooltipPhone.classList.add('tooltip');
    tooltipMail.classList.add('tooltip');
    tooltipFb.classList.add('tooltip');
    tooltipSub.classList.add('tooltip');
    tooltipTextVk.classList.add('tooltiptext');
    tooltipTextPhone.classList.add('tooltiptext');
    tooltipTextMail.classList.add('tooltiptext');
    tooltipTextFb.classList.add('tooltiptext');
    tooltipTextSub.classList.add('tooltiptext');

    tooltipVk.append(tooltipTextVk, vkIcon);
    tooltipPhone.append(tooltipTextPhone, phoneIcon);
    tooltipMail.append(tooltipTextMail, mailIcon);
    tooltipFb.append(tooltipTextFb, fbIcon);
    tooltipSub.append(tooltipTextSub, subIcon);

    return {
      tooltipVk,
      tooltipPhone,
      tooltipMail,
      tooltipFb,
      tooltipSub,
      circleIcon
    }
  }

  function createModalWindow(f) {
    const modalTitle = document.getElementById('modalTitle');
    const modalWindow = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalForm = document.getElementById('modal-form');
    const modalInpName = document.getElementById('modal-input_name');
    const modalInpSurName = document.getElementById('modal-input_surname');
    const modalInpLastName = document.getElementById('modal-input_lastname');
    const modalBtnNewContact = document.getElementById('modal_btn_newContact');
    const accordionHeader = document.getElementById('accordion-header');
    const modalBtnSave = document.createElement('button');
    const modalBtnChange = document.createElement('button');
    const modalBtnCansel = document.createElement('button');
    const modalBtnDeleteClient = document.createElement('button');
    const modalQuestionDeleteText = document.createElement('div');
    const modalCloseAreas = document.querySelectorAll('.modal-close');

    modalBtnCansel.setAttribute('id', 'btn_cansel');
    modalBtnCansel.classList.add('modal-form__btn_underline', 'btn-reset');
    modalBtnSave.setAttribute('id', 'btn_save');
    modalBtnSave.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnSave.textContent = 'Сохранить';
    modalForm.append(modalBtnSave);
    modalBtnDeleteClient.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnDeleteClient.setAttribute('id', 'btn-delete');
    modalBtnChange.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnChange.setAttribute('id', 'btn_change');
    modalQuestionDeleteText.classList.add('modal__question');

    modalBtnNewContact.addEventListener('click', (e) => {
      e.preventDefault();
      accordionHeader.classList.add('accordion__header_active');
      f();
    })

    modalBtnCansel.addEventListener('click', () => {
      modalWindow.classList.remove('modal-active');
      modalBtnDeleteClient.style.display = 'none';
      modalQuestionDeleteText.style.display = 'none';
      modalForm.style.display = 'flex';
      modalBtnCansel.remove();
      for (let inp of document.querySelectorAll('.modal-form__input')) {
        inp.value = '';
      }
    })

    modalCloseAreas.forEach(area => {
      area.addEventListener('click', () => {
        modalWindow.classList.remove('modal-active');
        modalBtnDeleteClient.style.display = 'none';
        modalQuestionDeleteText.style.display = 'none';
        modalForm.style.display = 'flex';
        modalBtnCansel.remove();
        modalBtnDeleteClient.remove();
        accordionHeader.classList.remove('accordion__header_active');
        document.querySelector('.accordion__header').innerHTML = "";
        for (let inp of document.querySelectorAll('.modal-form__input')) {
          inp.value = '';
          inp.classList.remove('just-validate-error-field');
        }
        for (let label of document.querySelectorAll('.just-validate-error-label')) {
          label.remove();
        }
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
      accordionHeader,
      modalBtnSave,
      modalBtnChange,
      modalBtnCansel,
      modalQuestionDeleteText,
      modalBtnDeleteClient,
      modalBtnNewContact,
      modalCloseAreas,
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

  function createModalWindowNewClient(func) {
    const validation = validator();
    func.modalTitle.textContent = 'Новый клиент';
    func.modalBtnChange.style.display = 'none';
    func.modalBtnSave.style.display = 'block'
    func.modalBtnCansel.textContent = 'Отмена';
    func.modalWindow.classList.add('modal-active');

    func.modalForm.append(func.modalBtnCansel);
    func.modalWindow.style.display = 'block';


    // Отправка Данных формы на сервер

    func.modalBtnSave.addEventListener('click', async function () {
        let newObj = await serverAddClient(getDataForm(func));
        if (validation.isValid) {
          clientsList.push(newObj);
          func.modalInpName.value = '';
          func.modalInpSurName.value = '';
          func.modalInpLastName.value = '';
          func.modalWindow.classList.remove('modal-active');
          location.reload();
      }

    })
  }

  // Функция создания модального окна изменения данных клиента

  function createModalWindowChange(event, func) {
    const validation = validator();
    func.modalTitle.textContent = `Изменить данные  ID: ${event.target.parentElement.id}`;
    func.modalQuestionDeleteText.style.display = 'none';
    func.modalBtnSave.style.display = 'none';
    func.modalBtnChange.style.display = 'block';
    func.modalBtnDeleteClient.style.display = 'block';
    func.modalBtnDeleteClient.classList.remove('modal-form__btn_purple');
    func.modalBtnDeleteClient.classList.add('modal-form__btn_underline');
    func.modalBtnDeleteClient.textContent = 'Удалить клиента';
    func.modalBtnChange.textContent = 'Сохранить';
    func.modalForm.append(func.modalBtnChange, func.modalBtnDeleteClient);
    func.modalWindow.classList.add('modal-active');
    func.accordionHeader.classList.add('accordion__header_active');
    func.modalWindow.style.display = 'block';
    // Заполнение инпутов
    for (let obj of clientsList) {
      if (obj.id.includes(event.target.parentElement.id)) {
        func.modalInpSurName.value = obj.surname;
        func.modalInpName.value = obj.name;
        func.modalInpLastName.value = obj.lastName;
        obj.contacts.forEach(el => {
          const createContactsForm = createContactInput();
          createContactsForm.contactInp.value = el.value;
          if (el.type === 'Телефон') {
            createContactsForm.contactInp.setAttribute('type', 'tel');
            createContactsForm.contactInp.setAttribute('id', 'tel');
            const im = new Inputmask ("+7 (999)-999-99-99");
            
            im.mask(createContactsForm.contactInp);
          }
          createContactsForm.choices.setChoiceByValue(el.type)
          
        })
        
        // Изменение данных
        func.modalBtnChange.addEventListener('click', async function () {
            await serverChangeClient(obj.id, getDataForm(func));
            if (validation.isValid) {
              func.modalWindow.classList.remove('modal-active');
              location.reload();
          }
        })

        // Удаление клиента
        func.modalBtnDeleteClient.addEventListener('click', async function () {
          await serverDeleteClient(obj.id);
          func.modalWindow.classList.remove('modal-active');
          location.reload();
        })
      }
    }
  }

  // Функция создания модального окна удаления клиента

  function createModalWindowDelete(event, func) {
    for (let obj of clientsList) {
      if (obj.id.includes(event.target.parentElement.id)) {
        func.modalTitle.textContent = 'Удалить клиента';
        func.modalForm.style.display = 'none';
        func.modalQuestionDeleteText.style.display = 'block';
        func.modalQuestionDeleteText.textContent = 'Вы действительно хотите удалить данного клиента?';
        func.modalBtnDeleteClient.style.display = 'block';
        func.modalBtnDeleteClient.classList.remove('modal-form__btn_underline');
        func.modalBtnDeleteClient.classList.add('modal-form__btn_purple');
        func.modalBtnDeleteClient.textContent = 'Удалить клиента';
        func.modalBtnCansel.textContent = 'Отмена';

        func.modalContent.append(func.modalQuestionDeleteText, func.modalBtnDeleteClient, func.modalBtnCansel);

        func.modalWindow.classList.add('modal-active');
        func.modalWindow.style.display = 'block';

        func.modalBtnDeleteClient.addEventListener('click', async function () {
          await serverDeleteClient(obj.id);
          func.modalWindow.classList.remove('modal-active');
          location.reload();
        })
      }
    }
  }

  function createContactInput() {
    const accordionHeader = document.getElementById('accordion-header');
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
    contactSelect.append(contactOptionMail, contactOptionTel, contactOptionVk, contactOptionFb, contactOptionOther);
    contactsForm.append(contactSelect, contactInp, contactBtnDelete);
    accordionHeader.append(contactsForm);

    const choices = new Choices(contactSelect, {
      searchEnabled: false,
      shouldSort: false,
      placeholder: true,
      itemSelectText: '',
      allowHTML: true
    });

    contactSelect.addEventListener('change', () => {
      const getValue = contactSelect.value;
      if (getValue === 'Телефон') {
        contactInp.value = '';
        contactInp.setAttribute('type', 'tel');
        contactInp.setAttribute('id', 'tel');
        /* Mask */
        const im = new Inputmask ("+7 (999)-999-99-99");

        im.mask(contactInp);
      }
      else if (getValue === 'Email') {
        contactInp.value = '';
        contactInp.setAttribute('type', 'Email');
        contactInp.setAttribute('id', 'Email');
        /* Mask */
        Inputmask.remove(contactInp);
      } else if (getValue === 'Vk') {
        contactInp.value = '';
        contactInp.setAttribute('type', 'text');
        contactInp.setAttribute('id', 'Vk');
        /* Mask */
        Inputmask.remove(contactInp);
      } else if (getValue === 'Facebook') {
        contactInp.value = '';
        contactInp.setAttribute('type', 'text');
        contactInp.setAttribute('id', 'Facebook');
        /* Mask */
        Inputmask.remove(contactInp);
      } else {
        contactInp.value = '';
        contactInp.setAttribute('type', 'text');
        contactInp.setAttribute('id', 'Other');
        /* Mask */
        Inputmask.remove(contactInp);
      }
    })

    accordionHeader.childElementCount === 10 ? contactBtnNewContact.setAttribute('disabled', 'disabled') : 0;

    contactBtnDelete.addEventListener('click', () => {
      contactInp.value = '';
      contactsForm.remove();
      accordionHeader.childElementCount < 10 ? contactBtnNewContact.removeAttribute('disabled') : 0;
    })

    if (contactSelect.value === 'Телефон') {
      contactInp.setAttribute('id', 'tel');
    }
    else if (contactSelect.value === 'Email') {
      contactInp.setAttribute('id', 'email');
    }

    return {
      accordionHeader,
      contactsForm,
      contactInp,
      contactSelect,
      choices
    };
  }


  // Функция сортировки

  const clientsSortList = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0);


// Функция сбора данных с формы

  function getDataForm(func) {

    let typeData = [];
    let valueData = [];
    for (let input of document.querySelectorAll('.accordion__input')) {
      valueData.push(input.value)
    }
    for (let select of document.querySelectorAll('#contacts-select')) {
      typeData.push(select.value);
    }
    
    const newClient = {
      name: func.modalInpName.value.trim(),
      surname: func.modalInpSurName.value.trim(),
      lastName: func.modalInpLastName.value.trim(),
      contacts: [],
      updatedAt: new Date(),
      createdAt: new Date()
    }

    
    for (let i = 0; i < typeData.length; i++) {
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
    sortDir = !sortDir;
    clientsList = clientsSortList(clientsList, this.id, sortDir);
    tBody.innerHTML = '';
    this.classList.toggle('arrow-down');
    getClients(clientsList);
    clientApp()
  }

  const modal = createModalWindow(createContactInput);

  function clientApp() {

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    // Кликеры сортировки

    thId.addEventListener('click', onClickSortClientsList);

    thFIO.addEventListener('click', onClickSortClientsList);

    thDateCreation.addEventListener('click', onClickSortClientsList);

    thLastChanges.addEventListener('click', onClickSortClientsList);

    // Кликеp Добавления нового клиента

    clientAddButton.addEventListener('click', () => createModalWindowNewClient(modal))


    // Кликеры изменения данных клиента

    const actionsBtns = document.querySelectorAll('.actions');

    for (let btn of actionsBtns) {
      btn.addEventListener('click', (e) => createModalWindowChange(e, modal))
    }

    // Кликеры удаления клиента

    const deleteBtns = document.querySelectorAll('#delete');

    deleteBtns.forEach(function (btn) {
      btn.addEventListener('click', (e) =>  createModalWindowDelete(e, modal))})

    // Поиск

    searchForm.addEventListener('input', (e) => {
      e.preventDefault();
      let time;
      let inp = async function () {
        clearTimeout(time);
        tBody.innerHTML = '';
        const searchDataValue = await serverSearchClients(searchInput.value.trim());
        getClients(searchDataValue);
      };
      if (!searchInput.value.trim()) {
        clearTimeout(time);
        tBody.innerHTML = '';
        clearTimeout(time);
        getClients(clientsList);
      }
      time = setTimeout(inp, 3000);
    })


  }

  getClients(clientsList);
  
  clientApp();
  

  console.log(clientsList)
  

})();