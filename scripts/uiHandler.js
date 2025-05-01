// scripts/uiHandler.js

// Make an element draggable within its container
function makeDraggable(el) {
  let dragging = false, startX, startY, origX, origY;
  el.style.cursor = 'move';
  el.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    const rect = el.getBoundingClientRect();
    origX = rect.left; origY = rect.top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });
  function onMouseMove(e) {
    if (!dragging) return;
    el.style.left = origX + (e.clientX - startX) - el.parentElement.getBoundingClientRect().left + 'px';
    el.style.top = origY + (e.clientY - startY) - el.parentElement.getBoundingClientRect().top + 'px';
  }
  function onMouseUp() {
    dragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

// Slide-out sidebar binding for text boxes
const textSidebar = document.getElementById('text-sidebar');
function bindTextBoxSidebar(tb) {
  tb.addEventListener('focus', () => textSidebar.classList.add('visible'));
  tb.addEventListener('blur', () => textSidebar.classList.remove('visible'));
}

// Create and insert a text box at given coordinates
function createTextBoxAt(x, y) {
  const tb = document.createElement('div');
  tb.className = 'text-box';
  tb.contentEditable = true;
  tb.style.position = 'absolute';
  tb.style.left = x + 'px';
  tb.style.top = y + 'px';
  tb.style.minWidth = '100px';
  tb.style.minHeight = '30px';
  tb.style.padding = '4px 8px';
  tb.style.border = '1px dashed #6366f1';
  tb.style.background = 'transparent';
  document.getElementById('pdf-container').appendChild(tb);
  bindTextBoxSidebar(tb);
  makeDraggable(tb);
  tb.focus();
}

// Expose createTextBoxAt globally for app.js
window.createTextBoxAt = createTextBoxAt;

// Expose annotation functions globally
window.createTextBoxAt = createTextBoxAt;
window.insertSignature = insertSignature;
window.insertCheckmark = insertCheckmark;
window.insertX = insertX;
window.insertCircle = insertCircle;


export { createTextBoxAt, insertSignature, insertCheckmark, insertX, insertCircle };

function insertCheckmark(x, y) {
  const container = document.getElementById('pdf-container');
  const el = document.createElement('div');
  el.className = 'annotation-checkmark';
  el.textContent = '✔️';
  el.style.position = 'absolute';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  container.appendChild(el);
}
function insertX(x, y) {
  const container = document.getElementById('pdf-container');
  const el = document.createElement('div');
  el.className = 'annotation-x';
  el.textContent = '✖️';
  el.style.position = 'absolute';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  container.appendChild(el);
}
function insertCircle(x, y) {
  const container = document.getElementById('pdf-container');
  const el = document.createElement('div');
  el.className = 'annotation-circle';
  el.style.position = 'absolute';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.border = '2px solid black';
  el.style.borderRadius = '50%';
  container.appendChild(el);
}

export { createTextBoxAt, insertCheckmark, insertX, insertCircle };