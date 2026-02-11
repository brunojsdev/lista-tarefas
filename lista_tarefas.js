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


// --- FUNDO: LINHAS DE CADERNO (ESTÁTICAS COM PULSO) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initAnimation(); // Recalcula as linhas ao redimensionar
}

class NotebookLine {
    constructor(y) {
        this.y = y;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.pulseSpeed = Math.random() * 0.005 + 0.002;
        this.pulseDir = 1;
    }

    update() {
        // Animação apenas na opacidade (Pulsar)
        this.opacity += this.pulseSpeed * this.pulseDir;
        if (this.opacity > 0.4 || this.opacity < 0.05) {
            this.pulseDir *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(width, this.y);
        // Cor Ciano da paleta (#00d2ff)
        ctx.strokeStyle = `rgba(0, 210, 255, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function initAnimation() {
    lines = [];
    const spacing = 40; // Espaço entre linhas (como um caderno)
    // Cria linhas cobrindo toda a altura
    for(let y = spacing; y < height; y += spacing) {
        lines.push(new NotebookLine(y));
    }
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
// Inicializa
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
initAnimation();
animate();
