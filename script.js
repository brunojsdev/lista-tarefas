/* ==========================================================================
   1. TASK MANAGEMENT LOGIC
   ========================================================================== */
let taskDatabase = [
    { id: 1, text: "Tarefa concluida  (-_-) ", status: true },
    { id: 2, text: "Escreva uma nova tarefa  (•‿•) ", status: false }
];

const inputField = document.getElementById('new-task-input');
const addButton = document.getElementById('btn-add-task');
const listContainer = document.getElementById('main-todo-list');
const counterText = document.getElementById('task-counter');

// Update UI based on current data
function updateUI() {
    if (!listContainer) return; // Segurança caso o elemento não exista na página
    
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
    if (!counterText) return;
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
if (addButton) addButton.addEventListener('click', addNewTask);
if (inputField) inputField.addEventListener('keypress', (e) => e.key === 'Enter' && addNewTask());


/* ==========================================================================
   2. BACKGROUND CANVAS ANIMATION (STARS)
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Star {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height; 
    this.size = Math.random() * 7 + 3;
    this.speed = Math.random() * 1.5 + 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.7 + 0.3;
  }

  update() {
    this.y += this.speed;
    if (this.y > height + this.size) {
      this.x = Math.random() * width;
      this.y = -20;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    
    const R_major = this.size;
    const R_minor = this.size * 0.25;

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      let angle = (i * Math.PI) / 4 - Math.PI / 2; 
      let radius = (i % 2 === 0) ? R_major : R_minor;
      let px = Math.cos(angle) * radius;
      let py = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    
    if (Math.random() > 0.98) {
       ctx.fillStyle = this.color;
       ctx.fill();
    }
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 15); 
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Star());
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

/* ==========================================================================
   3. START DO SCRIPT (O QUE FAZ TUDO APARECER AO CARREGAR)
   ========================================================================== */
resize();         
initParticles();  
animate();
updateUI(); // PARA AS TAREFAS APARECEREM!
