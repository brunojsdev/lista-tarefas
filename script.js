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
   2. ANIMAÇÃO DE FUNDO (CANVAS STARS)
   Cria um efeito de estrelas de 4 pontas curvadas (Estilo Ouros)
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Variáveis globais de controle do Canvas
let width, height;
let particles = [];

// Paleta de cores da animação
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

/* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

/* --- CLASSE PRINCIPAL: STAR (PARTÍCULAS) --- */
class Star {
  constructor() {
    this.init();
  }

  // Inicializa ou reseta as propriedades da estrela
  init() {
    this.x = Math.random() * width;
    this.y = Math.random() * height; 
    // Tamanho reduzido para melhor estética
    this.size = Math.random() * 4 + 3; 
    this.speed = Math.random() * 1.0 + 0.3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.3; 
  }

  // Atualiza a posição da partícula a cada frame
  update() {
    this.y += this.speed;
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + 20) {
      this.x = Math.random() * width;
      this.y = -20;
    }
  }

  // Desenha a estrela de 4 pontas curvada (Gordinha e Esticada)
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.globalAlpha = this.opacity;
    
    // Proporções estilo Naipe de Ouros
    const R_y = this.size * 1.8; // Vertical esticada
    const R_x = this.size * 1.2; // Horizontal gordinha
    const c = 0.25;              // Controle da curvatura (pontas finas)

    ctx.beginPath();
    ctx.moveTo(0, -R_y);

    // Curvas que formam o corpo da estrela
    ctx.quadraticCurveTo(R_x * c, -R_y * c, R_x, 0);   
    ctx.quadraticCurveTo(R_x * c, R_y * c, 0, R_y);    
    ctx.quadraticCurveTo(-R_x * c, R_y * c, -R_x, 0); 
    ctx.quadraticCurveTo(-R_x * c, -R_y * c, 0, -R_y); 
    
    ctx.closePath();

    // Estrela Oca por padrão
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    
    // Efeito de "piscar": preenche a estrela aleatoriamente
    if (Math.random() > 0.985) {
       ctx.globalAlpha = 1;
       ctx.fillStyle = this.color;
       ctx.fill();
    }
    
    ctx.restore();
  }
}

/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

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

/* --- EVENT LISTENERS --- */

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

/* --- START DO SCRIPT --- */
resize();         
initParticles();  
animate();
updateUI(); // PARA AS TAREFAS APARECEREM!
