// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Get elements from the DOM
  const fileInput = document.getElementById('fileInput'); // Input for uploading files
  const submitButton = document.getElementById('submit'); // Button to submit file
  const previewImage = document.getElementById('preview'); // Image preview container
  const resultContainer = document.getElementById('result'); // Container for results

  // Check that all elements exist
  if (!fileInput || !submitButton || !previewImage || !resultContainer) {
    console.error('One or more elements are missing in the HTML!');
    return;
  }

  // Preview selected image
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle file submission
  submitButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file to upload!');
      return;
    }

    // Simulate processing (replace this with your actual classification logic)
    resultContainer.textContent = 'Processing...';

    setTimeout(() => {
      // Example output (replace with real classification)
      const categories = ['Recycling', 'Compost', 'Garbage'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      resultContainer.textContent = `This item belongs in: ${randomCategory}`;
    }, 1000);
  });

});
