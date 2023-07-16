(async () => {

  let clientsList = [];

  // Async

  async function serverAddClient(obj) {
    let response = await fetch('http://localhost:3000' + '/api/clients', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj),
    })

    let data = await response.json();

    return data;
  }


  async function serverGetClientsList() {
    let response = await fetch('http://localhost:3000' + '/api/clients', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })

    let data = await response.json();
    
    return data;
  }

  async function serverDeleteClient(id) {
    let response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: "DELETE",
    })

    let data = await response.json();

    return data;
  }

  async function serverChangeClient(id, nameVal, surnameVal, lastNameVal) {
    let response = await fetch('http://localhost:3000' + '/api/clients/' + id, {
      method: "PATCH",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: nameVal, surname: surnameVal, lastName: lastNameVal})
    })

    let data = await response.json();

    return data;
  }

  let serverData = await serverGetClientsList();

  if (serverData) {
    clientsList = serverData;
  }


  console.log(clientsList);

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
  thDateCreation.setAttribute('id', 'DateCreation')
  thLastChanges.textContent = 'Последние изменения';
  thLastChanges.setAttribute('id', 'LastChanges');
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
    const clientTr = document.createElement('tr');
    const newDate = new Date()
    const clientId = document.createElement('td');
    const clientFIO = document.createElement('td');
    const greySpan = document.createElement('span');
    const clientDateOfCreation = document.createElement('td');
    const clientDateChanges = document.createElement('td');
    const clientContacts = document.createElement('td');
    const clientActions = document.createElement('td');
    const clientDeleteTd = document.createElement('td');

    clientActions.setAttribute('class', 'actions');
    clientDeleteTd.setAttribute('id', 'delete');
    clientId.setAttribute('id', 'number-of-id');
    greySpan.textContent = `  ${new Date(obj.updatedAt).getHours()}:${new Date(obj.updatedAt).getMinutes()}`;
    greySpan.style.color = '#B0B0B0';

    obj.FIO = obj.surname + ' ' + obj.name + ' ' + obj.lastName;
    clientId.textContent = obj.id;
    clientFIO.textContent = obj.FIO;
    clientDateOfCreation.textContent = `${new Date(obj.updatedAt).getDate()}.${new Date(obj.updatedAt).getMonth()}.${new Date(obj.updatedAt).getFullYear()}`;
    clientDateChanges.textContent = `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}   ${newDate.getHours()}:${newDate.getMinutes()}`;
    clientActions.textContent = 'Изменить';
    clientDeleteTd.textContent = 'Удалить';

    clientDateOfCreation.append(greySpan);
    clientTr.setAttribute('id', `${obj.id}`);
    clientTr.append(clientId, clientFIO, clientDateOfCreation, clientDateChanges, clientContacts, clientActions, clientDeleteTd);


    return clientTr;
  }

  function getClients(arr) {
    for (let obj of arr) {
      const newClient = createClient(obj);
      tBody.append(newClient);
    }
  }

  function modalWindow() {
    const modalTitle = document.getElementById('modalTitle');
    const modalWindow = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalForm = document.getElementById('modal-form');
    const modalInpName = document.getElementById('modal-input_name');
    const modalInpSurName = document.getElementById('modal-input_surname');
    const modalInpLastName = document.getElementById('modal-input_lastname');
    const modalBtnNewContact = document.getElementById('modal_btn_newContact');
    const modalBtnSave = document.getElementById('btn_save');
    const modalBtnChange = document.createElement('button');
    const modalBtnCansel = document.createElement('button');
    const modalBtnDeleteClient = document.createElement('button');
    const modalQuestionDeleteText = document.createElement('div');
    const modalClose = document.getElementById('close');

    modalBtnCansel.setAttribute('id', 'btn_cansel');
    modalBtnCansel.classList.add('modal-form__btn_underline', 'btn-reset');
    modalBtnDeleteClient.classList.add('modal-form__btn_purple' , 'btn-reset');
    modalBtnDeleteClient.setAttribute('id', 'btn-delete');
    modalBtnChange.classList.add('modal-form__btn_purple', 'btn-reset');
    modalBtnChange.setAttribute('id', 'btn_change');
    modalQuestionDeleteText.classList.add('modal__question');

    return {
      modalWindow,
      modalContent,
      modalTitle,
      modalForm,
      modalInpName,
      modalInpSurName,
      modalInpLastName,
      modalBtnSave,
      modalBtnChange,
      modalBtnCansel,
      modalQuestionDeleteText,
      modalBtnDeleteClient,
      modalBtnNewContact,
      modalClose
    }
  }
  

  // Функция сортировки

  const clientsSortList = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0);

  let sortProp = 'id';
  let sortDir = true;

  // Функция фильтрации

  function filterClients(arr, search) {
    return arr = arr.filter(obj => {
      for (let value of Object.values(obj)) {
        if (value.includes(search)) {
          return true;
        }
      }
    })
  }

  function clientApp() {

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const modal = modalWindow();


    // Кликеры

    thId.addEventListener('click', () => {
      sortProp = 'id';
      sortDir = !sortDir;
      clientsList = clientsSortList(clientsList, sortProp, sortDir);
      tBody.innerHTML = '';
      getClients(clientsList);
      thId.classList.toggle('arrow-down');
    })

    thFIO.addEventListener('click', () => {
      sortProp = 'FIO';
      sortDir = !sortDir;
      clientsList = clientsSortList(clientsList, sortProp, sortDir);
      tBody.innerHTML = '';
      getClients(clientsList);
      thFIO.classList.toggle('arrow-down');
    })

    thDateCreation.addEventListener('click', () => {
      sortProp = 'createdAt';
      sortDir = !sortDir;
      clientsList = clientsSortList(clientsList, sortProp, sortDir);
      tBody.innerHTML = '';
      getClients(clientsList);
      thDateCreation.classList.toggle('arrow-down');
    })

    thLastChanges.addEventListener('click', () => {
      sortProp = 'createdAt';
      sortDir = !sortDir;
      clientsList = clientsSortList(clientsList, sortProp, sortDir);
      tBody.innerHTML = '';
      getClients(clientsList);
      thLastChanges.classList.toggle('arrow-down');
    })

    // Кликеры Добавления нового клиента

    clientAddButton.addEventListener('click', () => {

      modal.modalTitle.textContent = 'Новый клиент';
      modal.modalBtnChange.style.display = 'none';
      modal.modalBtnSave.style.display = 'block'
      modal.modalBtnCansel.textContent = 'Отмена';
      modal.modalWindow.classList.add('modal-active');

      modal.modalForm.append(modal.modalBtnCansel);
    })

    modal.modalBtnCansel.addEventListener('click', () => {
      modal.modalWindow.classList.remove('modal-active');
      modal.modalBtnDeleteClient.style.display = 'none';
      modal.modalQuestionDeleteText.style.display = 'none';
      modal.modalForm.style.display = 'flex';
      modal.modalBtnCansel.remove();
      for (let inp of document.querySelectorAll('.modal-form__input')) {
        inp.value = '';
      }
    })

    modal.modalClose.addEventListener('click', () => {
      modal.modalWindow.classList.remove('modal-active');
      modal.modalBtnDeleteClient.style.display = 'none';
      modal.modalQuestionDeleteText.style.display = 'none';
      modal.modalForm.style.display = 'flex';
      modal.modalBtnCansel.remove();
      modal.modalBtnDeleteClient.remove();
      for (let inp of document.querySelectorAll('.modal-form__input')) {
        inp.value = '';
      }
    })

    // Кликеры изменения данных клиента

    const actionsBtns = document.querySelectorAll('.actions');

    actionsBtns.forEach((btn) => {
      btn.addEventListener('click', async function (e) {
        modal.modalTitle.textContent = `Изменить данные  ID: ${e.target.parentElement.id}`;
        modal.modalQuestionDeleteText.style.display = 'none';
        modal.modalBtnSave.style.display = 'none';
        modal.modalBtnChange.style.display = 'block';
        modal.modalBtnDeleteClient.style.display = 'block';
        modal.modalBtnDeleteClient.classList.remove('modal-form__btn_purple');
        modal.modalBtnDeleteClient.classList.add('modal-form__btn_underline');
        modal.modalBtnDeleteClient.textContent = 'Удалить клиента';
        modal.modalBtnChange.textContent = 'Сохранить';
        modal.modalForm.append(modal.modalBtnChange, modal.modalBtnDeleteClient);
        modal.modalWindow.classList.add('modal-active');
        // Заполнение инпутов
        for (let obj of clientsList) {
          if (obj.id.includes(e.target.parentElement.id)) {
            modal.modalInpSurName.value = obj.surname;
            modal.modalInpName.value = obj.name;
            modal.modalInpLastName.value = obj.lastName;
            // Изменение данных
            modal.modalBtnChange.addEventListener('click', async function() {
              await serverChangeClient(obj.id, modal.modalInpName.value, modal.modalInpSurName.value, modal.modalInpLastName.value);
            })

            modal.modalBtnDeleteClient.addEventListener('click', async function() {
              await serverDeleteClient(obj.id);
            })
          }
        }

      })
    })

    // Кликеры удаления клиента

    const deleteBtns = document.querySelectorAll('#delete');

    deleteBtns.forEach(async function(btn) {
      btn.addEventListener('click', async function(e) {
        for (let obj of clientsList) {
          if (obj.id.includes(e.target.parentElement.id)) {
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

            modal.modalBtnDeleteClient.addEventListener('click', async function(e) {
              await serverDeleteClient(obj.id);
            })
          }
        }
      })
    })

    // Поиск

    searchForm.addEventListener('input', (e) => {
      e.preventDefault();
      let time;
      let inp = function () {
        clearTimeout(time);
        tBody.innerHTML = '';
        getClients(filterClients(clientsList, searchInput.value.trim()));
      };
      if (!searchInput.value.trim()) {
        clearTimeout(time);
        tBody.innerHTML = '';
        clearTimeout(time);
        getClients(clientsList);
      }
      time = setTimeout(inp, 3000)
    })

    // Добавление нового клиента

    modal.modalBtnSave.addEventListener('click', async function () {
      const newClient = {
        name: modal.modalInpName.value.trim(),
        surname: modal.modalInpSurName.value.trim(),
        lastName: modal.modalInpLastName.value.trim(),
        contacts: [],
        updatedAt: new Date(),
        createdAt: new Date()
      }

      let newObj = serverAddClient(newClient);
      clientsList.push(newObj);
      tBody.innerHTML = '';
      getClients(clientsList);
      
    })
  }

  getClients(clientsList);

  modalWindow();

  clientApp();
})();