// Находим Элементы на странице

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(function (task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `  
                    <li id = "${task.id}"class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
})

checkEmptyList();

// Добавление задачи
    form.addEventListener('submit', addTask)

// Удаление задачи
    tasksList.addEventListener('click', deleteTask)

// Отмечаем задачу завершенной
    tasksList.addEventListener('click', doneTask)

// Функции
function addTask(event) {
     // Отменяем  отправку формы
     event.preventDefault();

     // Достаем текст задачи из поля ввода
     const taskText = taskInput.value

     // Описываем задачу в виде объекта
     const newTasks = {
        id: Date.now(),
        text: taskText,
        done:false,
     };

     // Добавляем объекст в массив с задачами
     tasks.push(newTasks)

     // Сохраняем список задач в хранилище браузера 
     saveToLocalStorage();
 
    // Формируем CSS класс
    const cssClass = newTasks.done ? "task-title task-title--done" : 'task-title';

     // Формируем разметку для новой задачи
     const taskHtml = `  
                    <li id = "${newTasks.id}"class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${newTasks.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>` 
 
     // Добавляем задачу на страницу
     tasksList.insertAdjacentHTML('beforeend', taskHtml);
 
     // Очищаем поле ввода и возвращаем на него фокус
     taskInput.value = ""
     taskInput.focus ()    
     
     checkEmptyList();
}

function deleteTask(event) {
    // Проверяем что клик по delete!
    if (event.target.dataset.action !== 'delete') return;

    const parenNode = event.target.closest('.list-group-item');

    // Определяем id задачи
    const id = Number(parenNode.id)

    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id);
    

    // Удаляем задачу из массива с задачами
    tasks.splice(index, 1)

    // Сохраняем список задач в хранилище браузера 
    saveToLocalStorage();

    parenNode.remove();   
    
    checkEmptyList();
}

function doneTask (event) {
    // Проверяем что клик был по "задача выполнена"
    if (event.target.dataset.action !== "done") return;


        const parenNode = event.target.closest('.list-group-item');

        // Определяем id задачи
        const id = Number(parenNode.id);
        const task = tasks.find((task) => task.id === id)
        task.done = !task.done;

        // Сохраняем список задач в хранилище браузера 
        saveToLocalStorage();

        const taskTitle = parenNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');         
    
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove(): null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}