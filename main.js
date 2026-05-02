const field = document.getElementById("field");
const formationSelect = document.getElementById("formationSelect");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const savedTeamsDiv = document.getElementById("savedTeams");
const teamNameInput = document.getElementById("teamName");

const formations = {
  "4-4-2": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "LD", x: 18, y: 25 },
    { pos: "DFC", x: 38, y: 25 },
    { pos: "DFC", x: 62, y: 25 },
    { pos: "LI", x: 82, y: 25 },
    { pos: "MD", x: 18, y: 50 },
    { pos: "MC", x: 38, y: 50 },
    { pos: "MC", x: 62, y: 50 },
    { pos: "MI", x: 82, y: 50 },
    { pos: "DC", x: 38, y: 80 },
    { pos: "DC", x: 62, y: 80 }
  ],
  "4-3-3": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "LD", x: 18, y: 25 },
    { pos: "DFC", x: 38, y: 25 },
    { pos: "DFC", x: 62, y: 25 },
    { pos: "LI", x: 82, y: 25 },
    { pos: "MC", x: 30, y: 50 },
    { pos: "MCD", x: 50, y: 46 },
    { pos: "MC", x: 70, y: 50 },
    { pos: "EI", x: 25, y: 80 },
    { pos: "DC", x: 50, y: 84 },
    { pos: "ED", x: 75, y: 80 }
  ],
  "4-2-3-1": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "LD", x: 18, y: 25 },
    { pos: "DFC", x: 38, y: 25 },
    { pos: "DFC", x: 62, y: 25 },
    { pos: "LI", x: 82, y: 25 },
    { pos: "MCD", x: 40, y: 43 },
    { pos: "MCD", x: 60, y: 43 },
    { pos: "EI", x: 25, y: 63 },
    { pos: "MCO", x: 50, y: 63 },
    { pos: "ED", x: 75, y: 63 },
    { pos: "DC", x: 50, y: 84 }
  ],
  "4-1-4-1": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "LD", x: 18, y: 25 },
    { pos: "DFC", x: 38, y: 25 },
    { pos: "DFC", x: 62, y: 25 },
    { pos: "LI", x: 82, y: 25 },
    { pos: "MCD", x: 50, y: 42 },
    { pos: "MD", x: 18, y: 58 },
    { pos: "MC", x: 38, y: 58 },
    { pos: "MC", x: 62, y: 58 },
    { pos: "MI", x: 82, y: 58 },
    { pos: "DC", x: 50, y: 84 }
  ],
  "3-5-2": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "DFC", x: 30, y: 26 },
    { pos: "DFC", x: 50, y: 24 },
    { pos: "DFC", x: 70, y: 26 },
    { pos: "MD", x: 15, y: 51 },
    { pos: "MC", x: 35, y: 51 },
    { pos: "MCD", x: 50, y: 47 },
    { pos: "MC", x: 65, y: 51 },
    { pos: "MI", x: 85, y: 51 },
    { pos: "DC", x: 40, y: 80 },
    { pos: "DC", x: 60, y: 80 }
  ],
  "3-4-3": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "DFC", x: 30, y: 26 },
    { pos: "DFC", x: 50, y: 24 },
    { pos: "DFC", x: 70, y: 26 },
    { pos: "MD", x: 20, y: 51 },
    { pos: "MC", x: 40, y: 51 },
    { pos: "MC", x: 60, y: 51 },
    { pos: "MI", x: 80, y: 51 },
    { pos: "EI", x: 25, y: 80 },
    { pos: "DC", x: 50, y: 84 },
    { pos: "ED", x: 75, y: 80 }
  ],
  "5-3-2": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "LD", x: 14, y: 26 },
    { pos: "DFC", x: 32, y: 25 },
    { pos: "DFC", x: 50, y: 23 },
    { pos: "DFC", x: 68, y: 25 },
    { pos: "LI", x: 86, y: 26 },
    { pos: "MC", x: 32, y: 52 },
    { pos: "MCD", x: 50, y: 48 },
    { pos: "MC", x: 68, y: 52 },
    { pos: "DC", x: 40, y: 80 },
    { pos: "DC", x: 60, y: 80 }
  ],
  "5-4-1": [
    { pos: "ARQ", x: 50, y: 10 },
    { pos: "LD", x: 14, y: 26 },
    { pos: "DFC", x: 32, y: 25 },
    { pos: "DFC", x: 50, y: 23 },
    { pos: "DFC", x: 68, y: 25 },
    { pos: "LI", x: 86, y: 26 },
    { pos: "MD", x: 20, y: 57 },
    { pos: "MC", x: 40, y: 57 },
    { pos: "MC", x: 60, y: 57 },
    { pos: "MI", x: 80, y: 57 },
    { pos: "DC", x: 50, y: 84 }
  ]
};

let currentPlayers = [];
let draggingIndex = null;
let dragMoved = false;

formationSelect.addEventListener("change", () => createFormation(formationSelect.value));
saveBtn.addEventListener("click", saveTeam);
clearBtn.addEventListener("click", clearField);

createFormation("4-4-2");
renderSavedTeams();

function createFormation(formationName) {
  const oldPlayers = currentPlayers;

  currentPlayers = formations[formationName].map((player, index) => ({
    ...player,
    name: oldPlayers[index]?.name || "",
    number: oldPlayers[index]?.number || index + 1
  }));

  renderField();
}

function renderField() {
  field.querySelectorAll(".player").forEach(el => el.remove());

  currentPlayers.forEach((player, index) => {
    const div = document.createElement("div");
    div.className = "player";
    div.style.left = `${player.x}%`;
    div.style.top = `${player.y}%`;

    div.innerHTML = `
      <div class="avatar"></div>
      <div class="shirt">
        <div class="number">${player.number || index + 1}</div>
      </div>
      <div class="name">${player.name || "Jugador"}</div>
      <div class="position">${player.pos}</div>
    `;

    div.addEventListener("click", () => {
      if (!dragMoved) editPlayer(index);
    });

    div.addEventListener("mousedown", e => startDrag(e, index));
    div.addEventListener("touchstart", e => startDrag(e, index), { passive: false });

    field.appendChild(div);
  });
}

function editPlayer(index) {
  const current = currentPlayers[index];

  const name = prompt(`Nombre para ${current.pos}:`, current.name);
  if (name === null) return;

  const number = prompt(`Número de camiseta:`, current.number || index + 1);
  if (number === null) return;

  current.name = name.trim();
  current.number = number.trim();

  renderField();
}

function startDrag(e, index) {
  e.preventDefault();
  draggingIndex = index;
  dragMoved = false;
}

document.addEventListener("mousemove", moveDrag);
document.addEventListener("touchmove", moveDrag, { passive: false });

function moveDrag(e) {
  if (draggingIndex === null) return;

  e.preventDefault();
  dragMoved = true;

  const rect = field.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  let x = ((clientX - rect.left) / rect.width) * 100;
  let y = ((clientY - rect.top) / rect.height) * 100;

  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(95, y));

  currentPlayers[draggingIndex].x = x;
  currentPlayers[draggingIndex].y = y;

  renderField();
}

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function stopDrag() {
  setTimeout(() => {
    draggingIndex = null;
    dragMoved = false;
  }, 120);
}

function saveTeam() {
  const teamName = teamNameInput.value.trim();

  if (!teamName) {
    alert("Poné un nombre para el equipo.");
    return;
  }

  const team = {
    id: Date.now(),
    name: teamName,
    formation: formationSelect.value,
    players: currentPlayers
  };

  const saved = getSavedTeams();
  saved.push(team);

  localStorage.setItem("dtTeams", JSON.stringify(saved));
  renderSavedTeams();
  alert("Equipo guardado.");
}

function getSavedTeams() {
  return JSON.parse(localStorage.getItem("dtTeams")) || [];
}

function renderSavedTeams() {
  const saved = getSavedTeams();
  savedTeamsDiv.innerHTML = "";

  if (saved.length === 0) {
    savedTeamsDiv.innerHTML = "<p>No hay equipos guardados todavía.</p>";
    return;
  }

  saved.forEach(team => {
    const div = document.createElement("div");
    div.className = "saved-team";

    div.innerHTML = `
      <strong>${team.name}</strong>
      <span>Formación: ${team.formation}</span>
      <button onclick="loadTeam(${team.id})">Cargar</button>
      <button class="delete-btn" onclick="deleteTeam(${team.id})">Borrar</button>
    `;

    savedTeamsDiv.appendChild(div);
  });
}

function loadTeam(id) {
  const saved = getSavedTeams();
  const team = saved.find(t => t.id === id);

  if (!team) return;

  teamNameInput.value = team.name;
  formationSelect.value = team.formation;
  currentPlayers = team.players;

  renderField();
}

function deleteTeam(id) {
  const saved = getSavedTeams().filter(team => team.id !== id);

  localStorage.setItem("dtTeams", JSON.stringify(saved));
  renderSavedTeams();
}

function clearField() {
  currentPlayers = currentPlayers.map(player => ({
    ...player,
    name: "",
    number: ""
  }));

  teamNameInput.value = "";
  renderField();
}