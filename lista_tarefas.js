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
    span.style.textDecoration = (span.style.textDecoration === 'line-through') ? 'none' : 'line-through';
    span.style.opacity = (span.style.textDecoration === 'line-through') ? '0.5' : '1';
}

function deleteTask(el) { el.closest('li').remove(); }
todoInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTodo(); });

// --- FUNDO: LINHAS DE CADERNO ESTÁTICAS COM PULSAR ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, lines = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    lines = [];
    for(let y = 60; y < height; y += 45) {
        lines.push({ y, opacity: Math.random() * 0.2 + 0.1, dir: Math.random() > 0.5 ? 1 : -1 });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    lines.forEach(l => {
        l.opacity += 0.002 * l.dir;
        if (l.opacity > 0.3 || l.opacity < 0.05) l.dir *= -1;
        ctx.beginPath();
        ctx.moveTo(0, l.y);
        ctx.lineTo(width, l.y);
        ctx.strokeStyle = `rgba(0, 210, 255, ${l.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
