const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function addTodo() {
    const text = todoInput.value;
    if (text.trim() === "") return;

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="text">${text}</span>
        <div class="actions">
            <span class="check" onclick="toggleTask(this)">✔</span>
            <span class="del" onclick="deleteTask(this)">✖</span>
        </div>
    `;
    todoList.appendChild(li);
    todoInput.value = "";
}

function toggleTask(el) {
    const li = el.closest('li');
    const span = li.querySelector('.text');
    if (span.style.textDecoration === 'line-through') {
        span.style.textDecoration = 'none';
        span.style.opacity = '1';
    } else {
        span.style.textDecoration = 'line-through';
        span.style.opacity = '0.5';
    }
}

function deleteTask(el) {
    el.closest('li').remove();
}

todoInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTodo();
});
