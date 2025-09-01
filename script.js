document.getElementById('upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const name = file.name.toLowerCase();
  let type = 'Garbage 🗑️';

  if (name.includes('plastic') || name.includes('can') || name.includes('paper')) {
    type = 'Recycle ♻️';
  } else if (name.includes('banana') || name.includes('food') || name.includes('leaf')) {
    type = 'Compost 🌿';
  }

  document.getElementById('result').textContent = `Classification: ${type}`;
});
