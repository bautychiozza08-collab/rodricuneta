const field = document.getElementById("field");
const formationSelect = document.getElementById("formationSelect");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const savedTeams = document.getElementById("savedTeams");
const teamNameInput = document.getElementById("teamName");

const formations = {
  "4-4-2": [[50,10],[20,25],[40,25],[60,25],[80,25],[20,50],[40,50],[60,50],[80,50],[40,80],[60,80]],
  "4-3-3": [[50,10],[20,25],[40,25],[60,25],[80,25],[30,50],[50,45],[70,50],[25,80],[50,85],[75,80]],
  "4-2-3-1": [[50,10],[20,25],[40,25],[60,25],[80,25],[40,45],[60,45],[25,65],[50,65],[75,65],[50,85]],
  "3-5-2": [[50,10],[30,25],[50,25],[70,25],[15,50],[35,50],[50,45],[65,50],[85,50],[40,80],[60,80]],
  "3-4-3": [[50,10],[30,25],[50,25],[70,25],[20,50],[40,50],[60,50],[80,50],[25,80],[50,85],[75,80]],
  "5-3-2": [[50,10],[15,25],[30,25],[50,25],[70,25],[85,25],[30,50],[50,45],[70,50],[40,80],[60,80]],
  "5-4-1": [[50,10],[15,25],[30,25],[50,25],[70,25],[85,25],[20,55],[40,55],[60,55],[80,55],[50,85]]
};

let players = [];
let draggingIndex = null;

formationSelect.addEventListener("change", createTeam);
saveBtn.addEventListener("click", saveTeam);
clearBtn.addEventListener("click", clearTeam);
exportBtn.addEventListener("click", exportImage);

createTeam();
loadSaved();

function createTeam() {
  const oldPlayers = players;

  players = formations[formationSelect.value].map((pos, i) => ({
    x: oldPlayers[i]?.x || pos[0],
    y: oldPlayers[i]?.y || pos[1],
    name: oldPlayers[i]?.name || "",
    number: oldPlayers[i]?.number || i + 1
  }));

  render();
}

function render() {
  field.innerHTML = "";

  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "player";
    div.style.left = p.x + "%";
    div.style.top = p.y + "%";

    div.innerHTML = `
      <div class="avatar"></div>
      <div class="shirt">
        <div class="number">${p.number}</div>
      </div>
      <div class="name">${p.name || "Jugador"}</div>
    `;

    div.addEventListener("click", () => editPlayer(i));
    div.addEventListener("mousedown", e => startDrag(e, i));
    div.addEventListener("touchstart", e => startDrag(e, i), { passive: false });

    field.appendChild(div);
  });
}

function editPlayer(i) {
  if (draggingIndex !== null) return;

  const name = prompt("Nombre del jugador:", players[i].name);
  if (name === null) return;

  const number = prompt("Número de camiseta:", players[i].number);
  if (number === null) return;

  players[i].name = name.trim();
  players[i].number = number.trim();

  render();
}

function startDrag(e, i) {
  e.preventDefault();
  draggingIndex = i;
}

document.addEventListener("mousemove", moveDrag);
document.addEventListener("touchmove", moveDrag, { passive: false });

function moveDrag(e) {
  if (draggingIndex === null) return;

  e.preventDefault();

  const rect = field.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  let x = ((clientX - rect.left) / rect.width) * 100;
  let y = ((clientY - rect.top) / rect.height) * 100;

  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(95, y));

  players[draggingIndex].x = x;
  players[draggingIndex].y = y;

  render();
}

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function stopDrag() {
  setTimeout(() => {
    draggingIndex = null;
  }, 80);
}

function saveTeam() {
  const name = teamNameInput.value.trim() || "Equipo";

  const data = {
    name,
    formation: formationSelect.value,
    players
  };

  const saved = JSON.parse(localStorage.getItem("teams") || "[]");
  saved.push(data);

  localStorage.setItem("teams", JSON.stringify(saved));
  loadSaved();

  alert("Equipo guardado.");
}

function loadSaved() {
  const saved = JSON.parse(localStorage.getItem("teams") || "[]");

  savedTeams.innerHTML = "";

  if (saved.length === 0) {
    savedTeams.innerHTML = "<p>No hay equipos guardados.</p>";
    return;
  }

  saved.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "saved-team";

    div.innerHTML = `
      <strong>${t.name}</strong>
      <p>${t.formation}</p>
      <button onclick="loadTeam(${i})">Cargar</button>
      <button onclick="deleteTeam(${i})">Borrar</button>
    `;

    savedTeams.appendChild(div);
  });
}

function loadTeam(i) {
  const saved = JSON.parse(localStorage.getItem("teams") || "[]");
  const team = saved[i];

  teamNameInput.value = team.name;
  formationSelect.value = team.formation;
  players = team.players;

  render();
}

function deleteTeam(i) {
  const saved = JSON.parse(localStorage.getItem("teams") || "[]");
  saved.splice(i, 1);

  localStorage.setItem("teams", JSON.stringify(saved));
  loadSaved();
}

function clearTeam() {
  players = players.map(p => ({
    ...p,
    name: "",
    number: ""
  }));

  teamNameInput.value = "";
  render();
}

function exportImage() {
  alert("Para exportar imagen real necesitamos agregar una librería. Por ahora podés hacer captura de pantalla.");
}