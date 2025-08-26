// Selectors

let todoBtn = document.getElementById('todo-btn');
let todoTxt = document.querySelector('#todo-txt');
let todoCheck = document.querySelector('#check');
let todoBox = document.querySelector('.todo-box');
let todoAlert = document.querySelector('[data-alert]');
let todoContainer = document.querySelector('.todo-container');
const STORAGE_KEY = 'todo.list';
const STORAGE_KEY_ID = 'todo.listId';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let completedTask = localStorage.getItem(STORAGE_KEY_ID);

// Functions

todoCheck.addEventListener('click', () => todoCheck.classList.toggle('checked'));
document.addEventListener('DOMContentLoaded', getStorage);
todoCheck.addEventListener('click', filterTasks);

window.onload = function () {
      todoTxt.focus();
}

todoBtn.onclick = function (e) {
      e.preventDefault();

      if (todoTxt.value.trim() === "") return;

      else {

      // let newAlert = document.querySelector('[data-alert]');

      // if (document.body.contains(newAlert)) {
      //       newAlert.remove();
      // }

      todoAlert.remove();
            
      let todoTaskContainer = document.createElement('div');

      todoContainer.insertAdjacentElement('beforeend', todoTaskContainer);

      todoTaskContainer.className = "todo-task-container";

      let todoCompleted = document.createElement('button');

      todoCompleted.className = "todo-completed";

      let todoCompletedIcon = document.createElement('i');

      todoCompletedIcon.className = "fas";
      
      todoCompletedIcon.classList.add("fa-check");

      todoCompleted.appendChild(todoCompletedIcon);

      let todoTask = document.createElement('p');

      todoTask.className = "todo-task";

      let todoTaskTxt = document.createTextNode(todoTxt.value);

      todoTask.append(todoTaskTxt);

      createList(todoTxt.value);

      let todo = createList(todoTxt.value);

      todos.push(todo);

      saveAndShow()

      let todoDelete = document.createElement('button');

      todoDelete.className = "todo-delete";

      todoDelete.innerHTML = `<i class="fas fa-trash"></i>`;

      todoTaskContainer.appendChild(todoCompleted);
      todoTaskContainer.appendChild(todoTask);
      todoTaskContainer.appendChild(todoDelete);

      todoTxt.value = null;

      todoTxt.focus();
      }

};

document.addEventListener('click', e => {
      item = e.target;

      if (item.className === "todo-delete") {
            item.parentElement.classList.add('drop');
            removeStorage(item);
            item.parentElement.addEventListener("transitionend", function() {
                  item.parentElement.remove();
                  if (todoContainer.childElementCount == 0) {
                        showAlert();
                  }
            })
      }
      if (item.className === "todo-completed") {
            item.nextSibling.classList.toggle('completed');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      }
});

function filterTasks(e) {
      let todoTasks = document.querySelectorAll('section div');
      todoTasks.forEach(todo => {
            if (e.target.classList.contains('checked')) {
                  if (todo.children[1].classList.contains('completed')) {
                        todo.style.display = 'block';
                  } else {
                        todo.style.display = 'none';
                  }
            } else if (!e.target.classList.contains('checked')) {
                  if (todo.children[1].classList.contains('completed')) {
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
      localStorage.setItem(STORAGE_KEY_ID, completedTask);
};

function getStorage() {
      todos.forEach(item => {
            todoContainer.innerHTML +=
            `
            <div class="todo-task-container">
            <button class="todo-completed" id="todo-completed">
                  <i class="fas fa-check"></i>
            </button>
            <p class="todo-task" data-todo-id="${item.id}">${item.name}</p>
            <button class="todo-delete" id="todo-delete">
                  <i class="fas fa-trash"></i>
            </button>
            </div>
            `
            }
      )
}

function removeStorage(todo) {
      let todoIndex = todo.children[0].innerText;
      todos.splice(todos.indexOf(todoIndex), 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createList(taskName) {
      return {id: Date.now().toString(),name: taskName};
}

!function () {
      if (document.body.contains(document.querySelector('.todo-task-container'))) {
            todoAlert.remove();
      }
}();
