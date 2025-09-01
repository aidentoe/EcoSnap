document.addEventListener('DOMContentLoaded', () => {

  const fileInput = document.getElementById('fileInput');
  const submitButton = document.getElementById('submit');
  const previewImage = document.getElementById('preview');
  const resultContainer = document.getElementById('result');

  if (!fileInput || !submitButton || !previewImage || !resultContainer) {
    console.error('One or more elements are missing!');
    return;
  }

  // Show preview when user selects a file
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        resultContainer.textContent = ''; // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  });

  // When user clicks submit, classify the file
  submitButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    // Here is where you would normally send the image to your classification model
    // For now, we'll simulate it with a random bin
    resultContainer.textContent = 'Analyzing...';

    setTimeout(() => {
      const bins = ['Recycling', 'Compost', 'Garbage'];
      const randomBin = bins[Math.floor(Math.random() * bins.length)];
      resultContainer.innerHTML = `
        <p><strong>Result:</strong> This item belongs in <em>${randomBin}</em>.</p>
        <p>Remember to check local guidelines!</p>
      `;
    }, 1000);
  });

});
