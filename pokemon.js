const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#303366",
  fire: "#f09326",
  flying: "#8lecec",
  grass: "#60b894",
  ground: "#EF8549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF"
};

const url =" https://pokeapi.co/api/v2/pokemon/"
const card = document.getElementById("card");
const generateBtn = document.getElementById("btn");
const downloadBtn = document.getElementById("download");

// Load image from URL and convert to base64
function loadImageAndConvertToBase64(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.src = url;
  });
}

async function generateCard(data) {
  const hp = data.stats[0].base_stat;
  const imageUrl = data.sprites.other["official-artwork"].front_default;
  const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
  const statAttack = data.stats[1].base_stat;
  const statDefense = data.stats[2].base_stat;
  const statSpeed = data.stats[5].base_stat;
  const themeColor = typeColor[data.types[0].type.name];

  const base64Img = await loadImageAndConvertToBase64(imageUrl);
  card.innerHTML = `
    <p class="hp"><span>HP</span>${hp}</p>
    <img src="${base64Img}" id="poke-image" />
    <h2 class="poke-name">${pokeName}</h2>
    <div class="types" id="types-container"></div>
    <div class="stats">
      <div><h3>${statAttack}</h3><p>Attack</p></div>
      <div><h3>${statDefense}</h3><p>Defense</p></div>
      <div><h3>${statSpeed}</h3><p>Speed</p></div>
    </div>
  `;

  appendTypes(data.types);
  styleCard(themeColor);
}

function appendTypes(types) {
  const typesContainer = document.querySelector(".types");
  typesContainer.innerHTML = "";
  types.forEach((item) => {
    let span = document.createElement("span");
    span.textContent = item.type.name;
    typesContainer.appendChild(span);
  });
}

function styleCard(color) {
  card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
  document.querySelectorAll(".types span").forEach((el) => {
    el.style.backgroundColor = color;
  });
}

async function getPokemon() {
  const randomId = Math.floor(Math.random() * 150) + 1;
  const res = await fetch(`${url}${randomId}`);
  const data = await res.json();
  generateCard(data);
}

generateBtn.addEventListener("click", getPokemon);

downloadBtn.addEventListener("click", () => {
  const image = document.getElementById("poke-image");
  if (!image.complete) {
    image.onload = () => downloadCard();
  } else {
    downloadCard();
  }
});

function downloadCard() {
  html2canvas(card).then((canvas) => {
    const link = document.createElement("a");
    link.download = "pokemon-card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Load default card
window.addEventListener("load", async () => {
  const res = await fetch(`${url}pikachu`);
  const data = await res.json();
  generateCard(data);
});


