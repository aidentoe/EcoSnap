const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");

// Keywords for classification
const categories = {
  compost: ["banana", "apple", "peel", "food", "leaf", "coffee", "egg"],
  recycle: ["bottle", "can", "cardboard", "paper", "box", "plastic"],
  garbage: ["chip", "styrofoam", "wrapper", "bag", "waste"]
};

// Handle drag and drop
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", e => {
  e.preventDefault();
  dropzone.classList.add("drag");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
dropzone.addEventListener("drop", e => {
  e.preventDefault();
  dropzone.classList.remove("drag");
  handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", e => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file) return;
  classifyItem(file.name.toLowerCase());
}

function classifyItem(filename) {
  let category = "garbage"; // default
  let emoji = "🗑️";

  if (categories.compost.some(word => filename.includes(word))) {
    category = "compost";
    emoji = "🌿";
  } else if (categories.recycle.some(word => filename.includes(word))) {
    category = "recycle";
    emoji = "♻️";
  }

  result.className = "result " + category;
  result.textContent = `${emoji} This item goes to ${category.toUpperCase()}`;
}
