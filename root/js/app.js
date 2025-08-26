// Selectors
let todoBtn = document.getElementById('todo-btn');
let todoTxt = document.querySelector('#todo-txt');
let todoCheck = document.querySelector('#check');
let todoBox = document.querySelector('.todo-box');
let todoAlert = document.querySelector('[data-alert]');
let todoContainer = document.querySelector('.todo-container');
let todoReminder = document.getElementById('todo-reminder'); // ⏰ reminder input

// ✅ Add reminder sound
let reminderSound = new Audio("reminder.mp3");
reminderSound.load(); // preload

// 👉 unlock audio once user interacts (required for Chrome autoplay policy)
document.addEventListener("click", () => {
  reminderSound.play().then(() => {
    reminderSound.pause();
    reminderSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

const STORAGE_KEY = 'todo.list';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Functions
todoCheck.addEventListener('click', () => todoCheck.classList.toggle('checked'));
document.addEventListener('DOMContentLoaded', getStorage);
todoCheck.addEventListener('click', filterTasks);

window.onload = function () {
  todoTxt.focus();
};

todoBtn.onclick = function (e) {
  e.preventDefault();

  if (todoTxt.value.trim() === "") return;

  todoAlert.remove();

  let todoTaskContainer = document.createElement('div');
  todoTaskContainer.className = "todo-task-container";

  let todoCompleted = document.createElement('button');
  todoCompleted.className = "todo-completed";
  todoCompleted.innerHTML = `<i class="fas fa-check"></i>`;

  let todoTask = document.createElement('p');
  todoTask.className = "todo-task";
  todoTask.textContent = todoTxt.value;

  let todoDelete = document.createElement('button');
  todoDelete.className = "todo-delete";
  todoDelete.innerHTML = `<i class="fas fa-trash"></i>`;

  todoTaskContainer.appendChild(todoCompleted);
  todoTaskContainer.appendChild(todoTask);

  // ⏰ reminder show
  if (todoReminder.value) {
    let reminderTag = document.createElement('small');
    reminderTag.className = "reminder-tag";
    reminderTag.innerText = "⏰ " + todoReminder.value.replace("T", " ");
    todoTaskContainer.appendChild(reminderTag);
  }

  todoTaskContainer.appendChild(todoDelete);
  todoContainer.appendChild(todoTaskContainer);

  let todo = createList(todoTxt.value, todoReminder.value);
  todos.push(todo);
  saveAndShow();

  // ✅ Reminder trigger
  if (todoReminder.value) {
    scheduleReminder(todo);
  }

  todoTxt.value = "";
  todoReminder.value = "";
  todoTxt.focus();
};

document.addEventListener('click', e => {
  let item = e.target;

  // delete
  if (item.closest('.todo-delete')) {
    let parent = item.closest('.todo-task-container');
    removeStorage(parent.querySelector('.todo-task').dataset.todoId);
    parent.remove();
    if (todoContainer.childElementCount == 0) {
      showAlert();
    }
  }

  // complete
  if (item.closest('.todo-completed')) {
    let task = item.closest('.todo-task-container').querySelector('.todo-task');
    task.classList.toggle('completed');
    saveAndShow();
  }
});

function filterTasks(e) {
  let todoTasks = document.querySelectorAll('.todo-task-container');
  todoTasks.forEach(todo => {
    if (e.target.classList.contains('checked')) {
      if (todo.querySelector('.todo-task').classList.contains('completed')) {
        todo.style.display = 'block';
      } else {
        todo.style.display = 'none';
      }
    } else {
      if (todo.querySelector('.todo-task').classList.contains('completed')) {
        todo.style.display = 'none';
      } else {
        todo.style.display = 'block';
      }
    }
  });
}

function showAlert() {
  let newAlert = todoAlert.cloneNode(true);
  newAlert.className = "alert";
  todoBox.insertBefore(newAlert, todoContainer);
}

function saveAndShow() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getStorage() {
  todos.forEach(item => {
    let reminderHtml = item.reminder ? `<small class="reminder-tag">⏰ ${item.reminder.replace("T", " ")}</small>` : "";
    todoContainer.innerHTML += `
      <div class="todo-task-container">
        <button class="todo-completed">
          <i class="fas fa-check"></i>
        </button>
        <p class="todo-task" data-todo-id="${item.id}">${item.name}</p>
        ${reminderHtml}
        <button class="todo-delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    // restore reminder
    if (item.reminder) {
      scheduleReminder(item);
    }
  });

  if (todos.length > 0) {
    todoAlert.remove();
  }
}

function removeStorage(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveAndShow();
}

function createList(taskName, reminderTime = "") {
  return { id: Date.now().toString(), name: taskName, reminder: reminderTime };
}

// ✅ schedule reminder with sound
function scheduleReminder(todo) {
  const reminderDate = new Date(todo.reminder);
  const now = new Date();
  const timeDiff = reminderDate.getTime() - now.getTime();

  if (timeDiff > 0) {
    setTimeout(() => {
      alert(`⏰ Reminder: ${todo.name}`);
      reminderSound.currentTime = 0; // reset
      reminderSound.play(); // 🔊 play sound
    }, timeDiff);
  }
}

// remove alert if already tasks exist
!function () {
  if (document.body.contains(document.querySelector('.todo-task-container'))) {
    todoAlert.remove();
  }
}();
