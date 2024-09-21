
const apiUrl = 'https://maxkendall.com/api/todos';
const todoInput = document.getElementById('todoInput');
const addTodoButton = document.getElementById('addTodo');
const activeTodoList = document.getElementById('activeTodoList');
const completedTodoList = document.getElementById('completedTodoList');
const toggleCompletedButton = document.getElementById('toggleCompleted');

async function fetchTodos() {
    try {
        const response = await fetch(apiUrl);
        const todos = await response.json();
        activeTodoList.innerHTML = '';
        completedTodoList.innerHTML = '';
        todos.forEach(todo => addTodoToList(todo));
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

addTodoButton.addEventListener('click', async () => {
    const todoTitle = todoInput.value;
    if (!todoTitle) return;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: todoTitle }),
        });

        if (response.ok) {
            const newTodo = await response.json();
            addTodoToList(newTodo);
            todoInput.value = '';
        } else {
            console.error('Failed to add todo:', await response.text());
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
});

function addTodoToList(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = todo.title;
    span.classList.add('todo-title');

    const containing_div = document.createElement('div')
    containing_div.classList.add('end-of-flexbox')
    const editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
    editIcon.addEventListener('click', () => makeEditable(span));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(containing_div)
    containing_div.appendChild(editIcon);

    if (todo.completed) {
        completedTodoList.appendChild(li);
    } else {
        activeTodoList.appendChild(li);
    }
}

async function toggleTodoCompletion(id, completed) {
    try {
        console.log(completed);
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'id': id, 'completed': completed }),
        });

        if (response.ok) {
            const updatedTodo = await response.json();
            // Re-fetch todos to ensure correct order
            fetchTodos();
        } else {
            console.error('Failed to update todo:', await response.text());
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

function makeEditable(span) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.classList.add('edit-input');
    
    input.addEventListener('blur', () => updateTodoTitle(span, input));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateTodoTitle(span, input);
        }
    });

    span.parentNode.replaceChild(input, span);
    input.focus();
}

async function updateTodoTitle(span, input) {
    const newTitle = input.value.trim();
    const todoId = input.parentNode.dataset.id;

    if (newTitle && newTitle !== span.textContent) {
        try {
            const response = await fetch(`${apiUrl}/${todoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'id': todoId, 'title': newTitle }),
            });

            if (response.ok) {
                span.textContent = newTitle;
            } else {
                console.error('Failed to update todo:', await response.text());
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }

    input.parentNode.replaceChild(span, input);
}

toggleCompletedButton.addEventListener('click', () => {
    completedTodoList.style.display = completedTodoList.style.display === 'none' ? 'block' : 'none';
});

fetchTodos();
