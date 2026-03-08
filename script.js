/* --- 1. TASK MANAGEMENT LOGIC --- */
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

// Variáveis globais de controle do Canvas
let width, height;
let particles = [];

// Paleta de cores da animação sincronizada com os DESTAQUES do CSS
const colors = ['#bbff00', '#ddff00', '#ffff00', '#ffcc00', '#ffaa00'];

/* --- FUNÇÕES DE CONTROLE DO CANVAS --- */

// Atualiza as dimensões do canvas para ocupar a tela inteira
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
    // Começa em uma posição Y aleatória para não caírem todas juntas no início
    this.y = Math.random() * height; 
    this.size = Math.random() * 7 + 3;          // Tamanho discreto (3px a 10px)
    this.speed = Math.random() * 1.5 + 0.5;     // Velocidade de queda suave
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.7 + 0.3;   // Transparência variada
  }

  // Atualiza a posição da partícula a cada frame
  update() {
    this.y += this.speed;
    
    // Se a estrela sair da tela pela parte de baixo, reseta para o topo
    if (this.y > height + this.size) {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 7 + 3;
      this.speed = Math.random() * 1.5 + 0.5;
    }
  }

  // Desenha a estrela de 4 pontas simples (estilo losango esticado)
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.2;
    
    // Proporções da estrela de 4 pontas
    const R_major = this.size;            // Pontas verticais e horizontais
    const R_minor = this.size * 0.25;     // Curvatura interna (mais fina para parecer brilho)

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      // Alterna entre raio maior e menor a cada 45 graus
      let angle = (i * Math.PI) / 4 - Math.PI / 2; 
      let radius = (i % 2 === 0) ? R_major : R_minor;

      let px = Math.cos(angle) * radius;
      let py = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Desenha o contorno da estrela
    ctx.stroke();
    
    // Efeito de "piscar": 2% de chance de preencher a estrela neste frame
    if (Math.random() > 0.98) {
       ctx.fillStyle = this.color;
       ctx.fill();
    }
    
    ctx.restore();
  }
}

/* --- INICIALIZAÇÃO E LOOP DE ANIMAÇÃO --- */

// Preenche o array com estrelas (densidade ajustada para não poluir o texto)
function initParticles() {
  particles = [];
  const particleCount = Math.floor(width / 15); 
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Star());
  }
}

// Loop principal de renderização
function animate() {
  // Limpa o canvas
  ctx.clearRect(0, 0, width, height);
  
  // Atualiza e desenha cada estrela
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}

/* --- EVENT LISTENERS --- */

// Recalcula o canvas ao redimensionar a janela
window.addEventListener('resize', () => {
  resize();
  initParticles();
});

/* --- START DO SCRIPT --- */
resize();         
initParticles();  
animate();
