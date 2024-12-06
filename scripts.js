document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const taskBoard = document.getElementById('taskboard');
    const loginForm = document.getElementById('login-form');
    const userEmail = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const columnsContainer = document.getElementById('columns');
    const addColumnButton = document.getElementById('add-column-button');
    const newColumnTitle = document.getElementById('new-column-title');

    // Lista de e-mails autorizados
    const authorizedEmails = ["daiane@mail.com"]; // E-mail autorizado

    // Função para salvar dados no localStorage
    function saveData(email, data) {
        localStorage.setItem(`taskboard-${email}`, JSON.stringify(data));
    }

    // Função para carregar dados do localStorage
    function loadData(email) {
        return JSON.parse(localStorage.getItem(`taskboard-${email}`) || '[]');
    }

    // Função para gerar um token de sessão (simples)
    function generateSessionToken() {
        return Math.random().toString(36).substr(2); // Gerando um token aleatório
    }

    // Função para renderizar os quadros
    function renderBoard(email, data) {
        columnsContainer.innerHTML = '';
        data.forEach((column, index) => {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            columnDiv.dataset.status = column.title.toLowerCase().replace(' ', '-');

            // Título da coluna
            const title = document.createElement('h2');
            title.textContent = column.title;
            title.addEventListener('click', () => toggleExpand(columnDiv));
            columnDiv.appendChild(title);

            // Tarefas da coluna
            const tasksDiv = document.createElement('div');
            tasksDiv.classList.add('tasks');
            column.tasks.forEach((task, taskIndex) => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');
                taskDiv.textContent = task;
                const deleteTaskButton = document.createElement('button');
                deleteTaskButton.textContent = 'Excluir';
                deleteTaskButton.addEventListener('click', () => deleteTask(email, data, index, taskIndex));
                taskDiv.appendChild(deleteTaskButton);
                tasksDiv.appendChild(taskDiv);
            });
            columnDiv.appendChild(tasksDiv);

            // Botão para adicionar nova tarefa
            const newTaskButton = document.createElement('button');
            newTaskButton.textContent = 'Nova tarefa';
            newTaskButton.classList.add('new-task');
            newTaskButton.addEventListener('click', () => addTask(email, data, index));
            columnDiv.appendChild(newTaskButton);

            // Botão para excluir o quadro
            const deleteColumnButton = document.createElement('button');
            deleteColumnButton.textContent = 'Excluir Quadro';
            deleteColumnButton.classList.add('delete-column');
            deleteColumnButton.addEventListener('click', () => deleteColumn(email, data, index));
            columnDiv.appendChild(deleteColumnButton);

            columnsContainer.appendChild(columnDiv);
        });
    }

    // Alternar entre expandir e colapsar os quadros
    function toggleExpand(columnDiv) {
        columnDiv.classList.toggle('expanded');
    }

    // Adicionar nova tarefa
    function addTask(email, data, columnIndex) {
        const newTask = prompt('Digite a nova tarefa:');
        if (newTask) {
            data[columnIndex].tasks.push(newTask);
            saveData(email, data);
            renderBoard(email, data);
        }
    }

    // Excluir tarefa
    function deleteTask(email, data, columnIndex, taskIndex) {
        if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
            data[columnIndex].tasks.splice(taskIndex, 1);
            saveData(email, data);
            renderBoard(email, data);
        }
    }

    // Excluir coluna
    function deleteColumn(email, data, columnIndex) {
        if (confirm('Tem certeza de que deseja excluir este quadro?')) {
            data.splice(columnIndex, 1);
            saveData(email, data);
            renderBoard(email, data);
        }
    }

    // Adicionar novo quadro
    addColumnButton.addEventListener('click', () => {
        const email = userEmail.textContent;
        const data = loadData(email);
        const title = newColumnTitle.value.trim();
        if (title) {
            data.push({ title, tasks: [] });
            saveData(email, data);
            renderBoard(email, data);
            newColumnTitle.value = '';
        }
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        // Verifique se o e-mail inserido está na lista de e-mails autorizados
        if (authorizedEmails.includes(email)) {
            const token = generateSessionToken(); // Gera um token para a sessão
            localStorage.setItem('sessionToken', token); // Salva o token no localStorage
            localStorage.setItem('userEmail', email); // Salva o e-mail no localStorage

            userEmail.textContent = email;
            loginScreen.classList.add('hidden');
            taskBoard.classList.remove('hidden');

            let data = loadData(email);
            if (data.length === 0) {
                data = [
                    { title: 'Feito', tasks: [] },
                    { title: 'Revisão', tasks: [] },
                    { title: 'Em Progresso', tasks: [] },
                    { title: 'A Fazer', tasks: [] }
                ];
                saveData(email, data);
            }
            renderBoard(email, data);
        } else {
            alert('E-mail não autorizado');
        }
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userEmail');
        taskBoard.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });

    // Alternar dark mode
    darkModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });
});
