document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const messageDiv = document.getElementById('message');
    const taskList = document.getElementById('taskList');

    // Função para carregar a lista de tarefas
    function loadTasks() {
        fetch('http://127.0.0.1:5000/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';

                data.forEach(task => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${task.id}</td>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td><button class="delete-btn" data-id="${task.id}">Excluir</button></td> <!-- Botão de Excluir -->
                    `;

                    taskList.appendChild(row);
                });

                // Adicionar event listener para os botões de exclusão
                const deleteButtons = document.querySelectorAll('.delete-btn');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const taskId = this.getAttribute('data-id');
                        deleteTask(taskId);
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar tarefas:', error));
    }

    // Função para excluir uma tarefa
    function deleteTask(taskId) {
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir tarefa.');
            }
            return response.json();
        })
        .then(data => {
            messageDiv.textContent = data.message;
            loadTasks(); // Recarregar a lista de tarefas após a exclusão
        })
        .catch(error => {
            messageDiv.textContent = error.message;
        });
    }

    // Carregar a lista de tarefas quando a página carregar
    loadTasks();

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(taskForm);
        const title = formData.get('title');
        const description = formData.get('description');

        fetch('http://127.0.0.1:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar tarefa.');
            }
            return response.json();
        })
        .then(data => {
            messageDiv.textContent = data.message;
            taskForm.reset();
            loadTasks();
        })
        .catch(error => {
            messageDiv.textContent = error.message;
        });
    });
});


