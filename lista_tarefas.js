// ... (Lógica anterior da Lista) ...
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


// --- ANIMAÇÃO DE FUNDO (LINHAS DE CADERNO) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Line {
    constructor() {
        this.init();
    }

    init() {
        this.y = Math.random() * height;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.2 + 0.05;
        this.width = Math.random() * width * 0.8 + width * 0.2; // Largura variada
        this.x = (width - this.width) / 2; // Centralizado
    }

    update() {
        this.y += this.speed;
        if (this.y > height) this.y = -10;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(0, this.y); // Linha ocupa a tela toda horizontalmente
        ctx.lineTo(width, this.y);
        ctx.strokeStyle = `rgba(0, 210, 255, ${this.opacity})`; // Ciano
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function initAnimation() {
    resize();
    lines = [];
    // Linhas espaçadas simulando caderno
    const count = 25; 
    for(let i=0; i<count; i++) lines.push(new Line());
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    lines.forEach(l => {
        l.update();
        l.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
initAnimation();
