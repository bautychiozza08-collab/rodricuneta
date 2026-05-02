const field = document.getElementById("field");
const formationSelect = document.getElementById("formationSelect");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const savedTeams = document.getElementById("savedTeams");
const teamNameInput = document.getElementById("teamName");

const formations = {
  "4-4-2": [
    [50,10],[20,25],[40,25],[60,25],[80,25],
    [20,50],[40,50],[60,50],[80,50],
    [40,80],[60,80]
  ],
  "4-3-3": [
    [50,10],[20,25],[40,25],[60,25],[80,25],
    [30,50],[50,45],[70,50],
    [25,80],[50,85],[75,80]
  ],
  "4-2-3-1": [
    [50,10],[20,25],[40,25],[60,25],[80,25],
    [40,45],[60,45],
    [25,65],[50,65],[75,65],
    [50,85]
  ],
  "3-5-2": [
    [50,10],[30,25],[50,25],[70,25],
    [15,50],[35,50],[50,45],[65,50],[85,50],
    [40,80],[60,80]
  ],
  "3-4-3": [
    [50,10],[30,25],[50,25],[70,25],
    [20,50],[40,50],[60,50],[80,50],
    [25,80],[50,85],[75,80]
  ],
  "5-3-2": [
    [50,10],[15,25],[30,25],[50,25],[70,25],[85,25],
    [30,50],[50,45],[70,50],
    [40,80],[60,80]
  ],
  "5-4-1": [
    [50,10],[15,25],[30,25],[50,25],[70,25],[85,25],
    [20,55],[40,55],[60,55],[80,55],
    [50,85]
  ]
};

let players = [];

formationSelect.addEventListener("change", createTeam);
saveBtn.addEventListener("click", saveTeam);
clearBtn.addEventListener("click", () => {
  players = players.map(p => ({...p, name:""}));
  render();
});

createTeam();

function createTeam() {
  const form = formations[formationSelect.value];

  players = form.map((pos,i)=>({
    x:pos[0],
    y:pos[1],
    name:"",
    number:i+1
  }));

  render();
}

function render() {
  field.innerHTML = "";

  players.forEach((p,i)=>{
    const div = document.createElement("div");
    div.className = "player";
    div.style.left = p.x+"%";
    div.style.top = p.y+"%";

    div.innerHTML = `
      <div class="avatar"></div>
      <div class="shirt">
        <div class="number">${p.number}</div>
      </div>
      <div class="name">${p.name || "Jugador"}</div>
    `;

    div.onclick = ()=>{
      const name = prompt("Nombre:",p.name);
      if(name!==null) p.name=name;

      const num = prompt("Número:",p.number);
      if(num!==null) p.number=num;

      render();
    };

    field.appendChild(div);
  });
}

function saveTeam() {
  const name = teamNameInput.value || "Equipo";

  const data = {
    name,
    formation: formationSelect.value,
    players
  };

  const saved = JSON.parse(localStorage.getItem("teams")||"[]");
  saved.push(data);

  localStorage.setItem("teams",JSON.stringify(saved));
  loadSaved();
}

function loadSaved() {
  const saved = JSON.parse(localStorage.getItem("teams")||"[]");

  savedTeams.innerHTML = "";

  saved.forEach((t,i)=>{
    const div = document.createElement("div");
    div.className = "saved-team";

    div.innerHTML = `
      <strong>${t.name}</strong>
      <p>${t.formation}</p>
      <button onclick="loadTeam(${i})">Cargar</button>
    `;

    savedTeams.appendChild(div);
  });
}

function loadTeam(i) {
  const saved = JSON.parse(localStorage.getItem("teams"));
  const t = saved[i];

  players = t.players;
  formationSelect.value = t.formation;
  teamNameInput.value = t.name;

  render();
}

loadSaved();