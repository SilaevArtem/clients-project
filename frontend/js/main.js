(() => {
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

    console.log(thFIO.textContent.substr(-3, 3))

    // Data

    let clientsList = [
        {
            id: '121231',
            createdAt: '2021-02-03T13:07:29.554Z',
            name: 'Артём',
            surname: 'Силаев',
            lastName: 'Владимирович',
            contacts: [
                {
                  type: 'Телефон',
                  value: '+71234567890'
                },
                {
                  type: 'Email',
                  value: 'abc@xyz.com'
                },
                {
                  type: 'Facebook',
                  value: 'https://facebook.com/vasiliy-pupkin-the-best'
                }
              ]
        },
        {
            id: '3753658',
            createdAt: '2019-05-03T13:07:29.554Z',
            name: 'Михаил',
            surname: 'Стрельцов',
            lastName: 'Николаевич',
            contacts: [
                {
                  type: 'Телефон',
                  value: '+79935769423'
                },
                {
                  type: 'Email',
                  value: 'sjfhbs@rambler.ru'
                },
                {
                  type: 'Facebook',
                  value: 'https://facebook.com/vasiliy-pupkin-the-best'
                }
              ]
        },
        {
            id: '3537828543',
            createdAt: '2009-01-03T13:07:29.554Z',
            name: 'Светлана',
            surname: 'Щёголева',
            lastName: 'Александровна',
            contacts: [
                {
                  type: 'Телефон',
                  value: '+79651345665'
                },
                {
                  type: 'Email',
                  value: 'xvbuiy@icloud.com'
                },
                {
                  type: 'Facebook',
                  value: 'https://facebook.com/vasiliy-pupkin-the-best'
                }
              ]
        },
    ]

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

        clientActions.setAttribute('id', 'actions');
        clientDeleteTd.setAttribute('id', 'delete');
        greySpan.textContent = newDate.getHours() + ':' + newDate.getMinutes();
        greySpan.style.color = '#B0B0B0';

        clientId.textContent = obj.id;
        clientFIO.textContent = obj.surname + ' ' + obj.name + ' ' + obj.lastName;
        clientDateOfCreation.textContent = `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}   `;
        clientDateChanges.textContent = `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}   ${newDate.getHours()}:${newDate.getMinutes()}`;
        clientActions.textContent = 'Изменить';
        clientDeleteTd.textContent = 'Удалить';

        clientDateOfCreation.append(greySpan);
        clientTr.append(clientId, clientFIO, clientDateOfCreation, clientDateChanges, clientContacts, clientActions, clientDeleteTd);

        return clientTr;
    }

    function getClients(arr) {
        for (let obj of arr) {
            const newClient = createClient(obj);
            tBody.append(newClient);
        }
    }

    getClients(clientsList);
})();