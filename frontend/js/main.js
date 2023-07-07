(() => {
    // Elements

    const app = document.getElementById('app');
    const table = document.createElement('table');
    const tHead = document.createElement('thead');
    const tBody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const thId = document.createElement('th');
    const thFIO = document.createElement('th');
    const thDateCreation = document.createElement('th');
    const thLastChanges = document.createElement('th');
    const thContacts = document.createElement('th');
    const thChanges = document.createElement('th');
    const thDelete = document.createElement('th');

    thId.textContent = 'ID';
    thFIO.textContent = 'Фамилия Имя Отчество';
    thDateCreation.textContent = 'Дата и время создания';
    thLastChanges.textContent = 'Последние изменения';
    thContacts.textContent = 'Контакты';
    thChanges.textContent = 'Действия';

    tr.append(thId, thFIO, thDateCreation, thLastChanges, thContacts, thChanges, thDelete);
    tHead.append(tr);
    table.append(tHead);
    table.append(tBody)
    app.append(table);
})();