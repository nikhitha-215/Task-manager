document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskCategory = document.getElementById('task-category');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // Load tasks from Local Storage on startup
    loadTasks();

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all tasks?")) {
            document.querySelectorAll('.task-list').forEach(list => {
                list.innerHTML = '';
            });
            saveTasksToLocalStorage();
            updateCounters();
        }
    });

    function addTask() {
        const text = taskInput.value.trim();
        const dateValue = taskDate.value;
        const category = taskCategory.value;

        if (text === '') return;

        createTaskElement(text, dateValue, category);
        saveTasksToLocalStorage();
        updateCounters();

        taskInput.value = '';
        taskDate.value = '';
        taskInput.focus();
    }

    function createTaskElement(text, date, category) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const taskText = document.createElement('p');
        taskText.textContent = text;
        taskContent.appendChild(taskText);

        if (date) {
            const taskDateTag = document.createElement('span');
            taskDateTag.classList.add('task-date-tag');
            taskDateTag.textContent = `Due: ${date}`;
            taskContent.appendChild(taskDateTag);
        }

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => {
            const newText = prompt("Edit your task:", taskText.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskText.textContent = newText.trim();
                saveTasksToLocalStorage();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => {
            taskCard.remove();
            saveTasksToLocalStorage();
            updateCounters();
        });

        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);

        taskCard.appendChild(taskContent);
        taskCard.appendChild(taskActions);

        const targetColumn = document.getElementById(category);
        if (targetColumn) {
            targetColumn.appendChild(taskCard);
        }
    }

    function saveTasksToLocalStorage() {
        const categories = ['todo', 'inprogress', 'done'];
        const allTasks = {};

        categories.forEach(cat => {
            const columnNode = document.getElementById(cat);
            const taskCards = columnNode.querySelectorAll('.task-card');
            const tasksData = [];

            taskCards.forEach(card => {
                const text = card.querySelector('p').textContent;
                const dateTag = card.querySelector('.task-date-tag');
                let date = '';
                if (dateTag) {
                    date = dateTag.textContent.replace('Due: ', '');
                }
                tasksData.push({ text, date });
            });

            allTasks[cat] = tasksData;
        });

        localStorage.setItem('taskflow_tasks', JSON.stringify(allTasks));
    }

    function loadTasks() {
        const savedData = localStorage.getItem('taskflow_tasks');
        if (!savedData) return;

        const allTasks = JSON.parse(savedData);
        Object.keys(allTasks).forEach(cat => {
            allTasks[cat].forEach(task => {
                createTaskElement(task.text, task.date, cat);
            });
        });

        updateCounters();
    }

    function updateCounters() {
        const categories = ['todo', 'inprogress', 'done'];
        categories.forEach(cat => {
            const count = document.getElementById(cat).children.length;
            document.getElementById(`${cat}-count`).textContent = count;
        });
    }
});