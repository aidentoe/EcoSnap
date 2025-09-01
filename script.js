document.getElementById('upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  // Preview image
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  preview.appendChild(img);

  // Classification logic
  const name = file.name.toLowerCase();
  let type = 'Garbage 🗑️';
  let color = '#fee2e2'; // red

  if (name.includes('plastic') || name.includes('can') || name.includes('paper')) {
    type = 'Recycle ♻️';
    color = '#dbeafe'; // blue
  } else if (name.includes('banana') || name.includes('food') || name.includes('leaf')) {
    type = 'Compost 🌿';
    color = '#dcfce7'; // green
  }

  const result = document.getElementById('result');
  result.textContent = `Classification: ${type}`;
  result.style.backgroundColor = color;
  result.style.padding = '1rem';
  result.style.borderRadius = '8px';
});
