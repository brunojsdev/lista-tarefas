/*
  ==========================================================================
  ÍNDICE DO ARQUIVO (JavaScript)
  1. LÓGICA DE NEGÓCIO (Gerenciamento de Tarefas)
  2. INTERFACE E TEMAS (UI e Event Listeners)
  3. MOTOR DE ANIMAÇÃO (Canvas API - Espaço Sideral)
     - Configurações e Variáveis
     - Classe Star (Partículas Geométricas)
     - Classe ShootingStar (Cometas)
     - Ciclo de Animação e Inicialização
  ==========================================================================
*/

/* 1. LÓGICA DE NEGÓCIO: Manipulação do banco de dados local e UI */

let taskDatabase = [
  { id: 1, text: "Tarefa concluida", status: true },
];

const inputField = document.getElementById("new-task-input");
const addButton = document.getElementById("btn-add-task");
const listContainer = document.getElementById("main-todo-list");
const counterText = document.getElementById("task-counter");

/* Atualiza a lista visual baseada no array de dados */
function updateUI() {
  if (!listContainer) return; // Segurança caso o elemento não exista na página

  listContainer.innerHTML = "";

  if (taskDatabase.length === 0) {
    listContainer.innerHTML =
      '<p class="empty-message">Nenhum processo ativo no momento...</p>';
  } else {
    taskDatabase.forEach((item) => {
      const row = document.createElement("div");
      row.className = `todo-item ${item.status ? "done" : ""}`;

      row.innerHTML = `
                <div class="text-content">${item.text}</div>
                <div class="action-btns">
                    <button class="btn-ui complete" onclick="toggleStatus(${item.id})" title="Finalizar">
                        ${item.status ? "⟲" : "✓"}
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

/* Atualiza o contador de tarefas pendentes no cabeçalho */
function updateCounter() {
  if (!counterText) return;
  const pending = taskDatabase.filter((t) => !t.status).length;
  const total = taskDatabase.length;
  counterText.textContent = `${pending} tarefas pendentes de ${total} totais`;
}

/* Adiciona uma nova tarefa ao início da lista */
function addNewTask() {
  const val = inputField.value.trim();
  if (val) {
    taskDatabase.unshift({
      id: Date.now(),
      text: val,
      status: false,
    });
    inputField.value = "";
    updateUI();
  }
}

/* Alterna entre concluída e pendente */
function toggleStatus(id) {
  taskDatabase = taskDatabase.map((t) =>
    t.id === id ? { ...t, status: !t.status } : t,
  );
  updateUI();
}

/* Remove a tarefa permanentemente do array */
function removeItem(id) {
  taskDatabase = taskDatabase.filter((t) => t.id !== id);
  updateUI();
}

/* Escuta cliques e teclas para interação com o usuário */
if (addButton) addButton.addEventListener("click", addNewTask);
if (inputField)
  inputField.addEventListener(
    "keypress",
    (e) => e.key === "Enter" && addNewTask(),
  );

/* 2. INTERFACE E TEMAS: Persistência e Controle de UI */
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    setTimeout(() => {
      if (window.refreshSpace) window.refreshSpace();
    }, 100);
  }

  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      if (window.refreshSpace) window.refreshSpace();
    });
  }

  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

/* 3. MOTOR DE ANIMAÇÃO: Renderização espacial via Canvas */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [];
let shootingStars = [];

/* 3.1 Configurações de Cores Reativas */
const darkStarColors = ["#ffffff", "#fff4e6", "#ffdd00", "#ffaa00", "#ffcc80", "#e6f2ff"];
const lightStarColors = ["#150136", "#090024", "#5752ff", "#3b35cc", "#8b87ff", "#17005c"];

window.refreshSpace = function () {
  initSpace();
};

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

/* 3.2 Classe Star: Lógica das estrelas fixas e descendentes */
class Star {
  constructor() {
    this.init();
  }

  init() {
    this.type = Math.floor(Math.random() * 3) + 1;
    let baseSize = Math.random() * 2 + 0.5;

    if (this.type === 1) this.size = baseSize * 2.5;
    else if (this.type === 2) this.size = baseSize * 1.8;
    else this.size = baseSize * 1.2;

    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.baseSpeedX = (Math.random() - 0.5) * 0.1;
    this.baseSpeedY = baseSize * 0.4 + 0.2;

    const isLightMode = document.body.classList.contains("light-mode");
    const activeColors = isLightMode ? lightStarColors : darkStarColors;
    this.color = activeColors[Math.floor(Math.random() * activeColors.length)];

    this.maxOpacity = Math.random() * 0.7 + 0.3;
    this.opacity = this.maxOpacity;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.baseSpeedX;
    this.y += this.baseSpeedY;
    this.twinklePhase += this.twinkleSpeed;
    this.opacity = (Math.sin(this.twinklePhase) * 0.5 + 0.5) * this.maxOpacity;

    if (this.y > height + 20) {
      this.y = -20;
      this.x = Math.random() * width;
    }
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
  }

  draw() {
    const alpha = this.opacity;
    ctx.globalAlpha = alpha * 0.2;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    this._drawFourPointStar(this.x, this.y, this.size);
    ctx.restore();
    ctx.globalAlpha = 1.0;
  }

  _drawFourPointStar(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s * 2.5);
    ctx.lineTo(x + s * 0.4, y - s * 0.4);
    ctx.lineTo(x + s * 2.5, y);
    ctx.lineTo(x + s * 0.4, y + s * 0.4);
    ctx.lineTo(x, y + s * 2.5);
    ctx.lineTo(x - s * 0.4, y + s * 0.4);
    ctx.lineTo(x - s * 2.5, y);
    ctx.lineTo(x - s * 0.4, y - s * 0.4);
    ctx.closePath();
    ctx.fill();
  }
}

/* 3.3 Classe ShootingStar: Lógica dos cometas aleatórios */
class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.active = false;
    if (Math.random() > 0.993) {
      this.active = true;
      this.x = Math.random() * width;
      this.y = -50;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 3);
      this.speedY = Math.random() * 5 + 7;
      this.len = Math.random() * 80 + 30;
      this.opacity = 1;
    }
  }
  update() {
    if (!this.active) {
      this.reset();
      return;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.015;
    if (this.opacity <= 0 || this.y > height || this.x < 0 || this.x > width) {
      this.active = false;
    }
  }
  draw() {
    if (!this.active) return;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - this.speedX * (this.len / 5),
      this.y - this.speedY * (this.len / 5),
    );
    ctx.lineWidth = this.size;
    ctx.lineCap = "round";

    let grad = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - this.speedX * (this.len / 10),
      this.y - this.speedY * (this.len / 10),
    );
    if (document.body.classList.contains("light-mode")) {
      grad.addColorStop(0, `rgba(21, 1, 54, ${this.opacity})`);
      grad.addColorStop(1, `rgba(87, 82, 255, 0)`);
    } else {
      grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      grad.addColorStop(1, `rgba(255, 170, 0, 0)`);
    }
    ctx.strokeStyle = grad;
    ctx.stroke();
  }
}

/* 3.4 Gerenciamento e Loop de Animação */
function initSpace() {
  resize();
  stars = [];
  shootingStars = [];
  const calculatedStars = Math.floor((width * height) / 12000);
  const numStars = Math.min(calculatedStars, 150);

  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }

  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach((p) => {
    p.update();
    p.draw();
  });

  shootingStars.forEach((s) => {
    s.update();
    s.draw();
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", initSpace);
resize();
window.refreshSpace();
animate();
updateUI();
