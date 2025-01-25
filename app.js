const apiUrl = 'https://u0pz6odn27.execute-api.ap-southeast-1.amazonaws.com/PRODUCTION/zerefapi';

async function fetchTodos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch todos');
        const todos = await response.json();
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `
                <input type="text" value="${todo.taskText}" id="todo-text-${todo.taskId}">
                <button onclick="updateTodo('${todo.taskId}')">Update</button>
                <button onclick="deleteTodo('${todo.taskId}')">Delete</button>
            `;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function createTodo() {
    const text = document.getElementById('new-todo').value;
    if (!text) return;
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: new Date().getTime().toString(), taskText: text })
    });
    document.getElementById('new-todo').value = '';
    fetchTodos();
}

async function updateTodo(id) {
    const text = document.getElementById(`todo-text-${id}`).value;
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskText: text })
    });
    fetchTodos();
}

async function deleteTodo(id) {
    console.log(`Attempting to delete task with ID: ${id}`);
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Failed to delete todo with status ${response.status}`);
        fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

function logout() {
    // Clear cookies (if any)
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });

    // Clear local storage (if any)
    localStorage.clear();
    sessionStorage.clear();

    alert('Logged out successfully!');
    // Optionally, redirect to login page
    window.location.href = 'https://ap-southeast-1nqdwiattm.auth.ap-southeast-1.amazoncognito.com/logout?client_id=5j4hc2mnhs81knqc40iji1dv27&logout_uri=https%3A%2F%2Fbaylen.pnbwebsite.click';
}


document.addEventListener('DOMContentLoaded', fetchTodos);
