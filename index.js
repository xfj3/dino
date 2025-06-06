
document.addEventListener('DOMContentLoaded', function () {
  const startText = document.getElementById('start-text');
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      if (startText) startText.style.display = 'none';
      // start the game logic here
    }
  });
});
