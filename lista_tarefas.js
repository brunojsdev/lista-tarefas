// --- Lógica da Lista de Tarefas ---
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
        </div>`;
    todoList.appendChild(li);
    todoInput.value = "";
}

function toggleTask(el) {
    const span = el.closest('li').querySelector('.text');
    span.style.textDecoration = span.style.textDecoration === 'line-through' ? 'none' : 'line-through';
    span.style.opacity = span.style.textDecoration === 'line-through' ? '0.5' : '1';
}

function deleteTask(el) { el.closest('li').remove(); }
todoInput.addEventListener("keypress", (e) => { if (e.key === "Enter") addTodo(); });

// --- ANIMAÇÃO DE FUNDO (SQUARES / TASKS) ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Paleta: Ciano (Principal), Vermelho (Delete) e tons neutros
const colors = ['#00d2ff', '#ef4444', '#1e293b', '#e2e8f0'];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Square {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height - height;
    this.size = Math.random() * 15 + 5;
    this.speed = Math.random() * 2 + 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.init();
      this.y = -20;
    }
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(this.x, this.y, this.size, this.size);
    
    if (Math.random() > 0.98) {
       ctx.fillStyle = this.color;
       ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 10);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Square());
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

resize();
initParticles();
animate();
