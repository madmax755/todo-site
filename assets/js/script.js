const apiUrl = 'https://maxkendall.com/api/todos';
const todoInput = document.getElementById('todoInput');
const addTodoButton = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

// Fetch todos on load
async function fetchTodos() {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    console.log(todos);
    todos.forEach(todo => addTodoToList(todo));
}

// Add a new todo
addTodoButton.addEventListener('click', async () => {
    const todoText = todoInput.value;
    if (!todoText) return;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: todoText }),
    });

    if (response.ok) {
        const newTodo = await response.json();
        addTodoToList(newTodo);
        todoInput.value = '';
    }
});

// Function to add todo to the list
function addTodoToList(todo) {
    const li = document.createElement('li');
    li.textContent = todo.text;
    todoList.appendChild(li);
}

// Initial fetch of todos
fetchTodos();
