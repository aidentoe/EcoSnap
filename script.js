const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileElem');
const resultDiv = document.getElementById('result');
const historyDiv = document.getElementById('history');

let history = [];

// Drag & Drop handlers
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('highlight');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('highlight');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('highlight');
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgSrc = e.target.result;
    classifyItem(imgSrc);
  }
  reader.readAsDataURL(file);
}

// Simulated classification and tips
function classifyItem(imgSrc) {
  const categories = ['Recycling ♻️', 'Compost 🍂', 'Trash 🗑️'];
  const tips = [
    "Rinse containers before recycling.",
    "Plastic bags go to specialized bins.",
    "Composting reduces methane emissions."
  ];

  const randomIndex = Math.floor(Math.random() * categories.length);
  const category = categories[randomIndex];
  const tip = tips[randomIndex];

  resultDiv.innerHTML = `
    <img src="${imgSrc}" alt="Scanned item">
    <p><strong>Category:</strong> ${category}</p>
    <p><em>Tip:</em> ${tip}</p>
  `;

  // Add to history
  history.push({ img: imgSrc, category, tip });
  updateHistory();
}

function updateHistory() {
  if (history.length === 0) {
    historyDiv.innerHTML = `<p>No items scanned yet.</p>`;
    return;
  }

  historyDiv.innerHTML = history.map(item => `
    <div class="history-item">
      <img src="${item.img}" alt="History item">
      <p>${item.category}</p>
      <p><em>${item.tip}</em></p>
    </div>
  `).join('');
}
