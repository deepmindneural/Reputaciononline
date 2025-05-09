document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  alert('El clic derecho está deshabilitado en esta plataforma.');
  return false;
});

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 83 || e.keyCode === 85 || e.keyCode === 86 || e.keyCode === 117)) {
    e.preventDefault();
    return false;
  }
});

document.addEventListener('selectstart', function(e) {
  e.preventDefault();
  return false;
});
