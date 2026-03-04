/* --- LÓGICA DA TO-DO LIST --- */
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

function addTask() {
    const text = input.value.trim();
    if (text === '') return;

    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">Excluir</button>
    `;

    // Clique para marcar como concluída
    li.querySelector('.task-text').addEventListener('click', function() {
        this.classList.toggle('completed');
    });

    // Clique para excluir
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.style.opacity = '0';
        setTimeout(() => li.remove(), 300);
    });

    taskList.prepend(li);
    input.value = '';
    input.focus();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

/* --- ANIMAÇÃO DO CANVAS --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];
const colors = [ '#ffdd00', '#ffaa00', '#ff9900', '#5752ff', '#c9e4ff' ];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Square {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 2 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.8 + 0.4;
    }
    update() {
        this.y += this.speed;
        if (this.y > height) { this.init(); this.y = -20; }
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
    const particleCount = Math.floor(width / 15);
    for (let i = 0; i < particleCount; i++) particles.push(new Square());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize(); initParticles(); animate();
