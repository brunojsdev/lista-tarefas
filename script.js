/* --- 1. TASK MANAGEMENT LOGIC --- */
let taskDatabase = [
    { id: 1, text: "Configurar ambiente de desenvolvimento", status: true },
    { id: 2, text: "Implementar design responsivo", status: false }
];

const inputField = document.getElementById('new-task-input');
const addButton = document.getElementById('btn-add-task');
const listContainer = document.getElementById('main-todo-list');
const counterText = document.getElementById('task-counter');

// Update UI based on current data
function updateUI() {
    listContainer.innerHTML = '';

    if (taskDatabase.length === 0) {
        listContainer.innerHTML = '<p class="empty-message">Nenhum processo ativo no momento...</p>';
    } else {
        taskDatabase.forEach(item => {
            const row = document.createElement('div');
            row.className = `todo-item ${item.status ? 'done' : ''}`;
            
            row.innerHTML = `
                <div class="text-content">${item.text}</div>
                <div class="action-btns">
                    <button class="btn-ui complete" onclick="toggleStatus(${item.id})" title="Finalizar">
                        ${item.status ? '⟲' : '✓'}
                    </button>
                    <button class="btn-ui remove" onclick="removeItem(${item.id})" title="Remover">
                        ✕
                    </button>
                </div>
            `;
            listContainer.appendChild(row);
        });
    }
    updateCounter();
}

// Update task counter
function updateCounter() {
    const pending = taskDatabase.filter(t => !t.status).length;
    const total = taskDatabase.length;
    counterText.textContent = `${pending} tarefas pendentes de ${total} totais`;
}

// Add new task function
function addNewTask() {
    const val = inputField.value.trim();
    if (val) {
        taskDatabase.unshift({
            id: Date.now(),
            text: val,
            status: false
        });
        inputField.value = '';
        updateUI();
    }
}

// Toggle task status
function toggleStatus(id) {
    taskDatabase = taskDatabase.map(t => t.id === id ? {...t, status: !t.status} : t);
    updateUI();
}

// Remove task
function removeItem(id) {
    taskDatabase = taskDatabase.filter(t => t.id !== id);
    updateUI();
}

// Listeners
addButton.addEventListener('click', addNewTask);
inputField.addEventListener('keypress', (e) => e.key === 'Enter' && addNewTask());


/* --- 2. BACKGROUND CANVAS ANIMATION --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h;
let elements = [];
const themeColors = [ '#ffdd00', '#ffaa00', '#5752ff', '#c9e4ff' ];

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    elements = [];
    const count = Math.floor(w / 12);
    for (let i = 0; i < count; i++) elements.push(new Particle());
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h - h;
        this.size = Math.random() * 12 + 4;
        this.v = Math.random() * 1.5 + 0.5;
        this.color = themeColors[Math.floor(Math.random() * themeColors.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.y += this.v;
        if (this.y > h) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        if(Math.random() > 0.99) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

function loop() {
    ctx.clearRect(0, 0, w, h);
    elements.forEach(e => { e.update(); e.draw(); });
    requestAnimationFrame(loop);
}

// Event Listeners for Canvas
window.addEventListener('resize', initCanvas);

// Global Init
window.onload = () => {
    initCanvas();
    loop();
    updateUI();
};
