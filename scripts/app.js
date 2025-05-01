
import { loadPDF, savePDF } from './pdfHandler.js';
import { loadRecentFiles, saveCurrentFile } from './storageHandler.js';
import { createTextBoxAt, insertCheckmark, insertX, insertCircle } from './uiHandler.js';
import { openSignatureModal, closeSignatureModal } from './signatureHandler.js';

document.addEventListener('DOMContentLoaded', () => {
  // Landing page upload
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = ev => {
          sessionStorage.setItem('pdfData', ev.target.result);
          sessionStorage.setItem('pdfName', file.name);
          saveCurrentFile(file.name);
          loadRecentFiles();
          window.location.href = 'editor.html';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Load recent files list
  loadRecentFiles();

  // If on editor page, load PDF
  if (window.location.pathname.endsWith('editor.html')) {
    loadPDF();
  }

  // Toolbar actions
  const toolbar = document.getElementById('toolbar');
  const container = document.getElementById('pdf-container');
  let modeListener = null;

  function cleanup() {
    if (modeListener && container) {
      container.removeEventListener('click', modeListener);
      modeListener = null;
    }
    ['text-mode','check-mode','x-mode','circle-mode'].forEach(c => {
      container.classList.remove(c);
    });
  }

  toolbar && toolbar.addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (!action) return;
    cleanup();
    switch(action) {
      case 'add-text':
        container.classList.add('text-mode');
        modeListener = ev => {
          const rect = container.getBoundingClientRect();
          createTextBoxAt(ev.clientX-rect.left, ev.clientY-rect.top);
          cleanup();
        };
        container.addEventListener('click', modeListener);
        break;
      case 'add-signature':
        // capture click then open modal
        modeListener = ev => {
          const rect = container.getBoundingClientRect();
          lastClick = { x: ev.clientX-rect.left, y: ev.clientY-rect.top };
          cleanup();
          openSignatureModal();
        };
        container.addEventListener('click', modeListener);
        break;
      case 'add-check':
        container.classList.add('check-mode');
        modeListener = ev => {
          const rect = container.getBoundingClientRect();
          insertCheckmark(ev.clientX-rect.left, ev.clientY-rect.top);
          cleanup();
        };
        container.addEventListener('click', modeListener);
        break;
      case 'add-x':
        container.classList.add('x-mode');
        modeListener = ev => {
          const rect = container.getBoundingClientRect();
          insertX(ev.clientX-rect.left, ev.clientY-rect.top);
          cleanup();
        };
        container.addEventListener('click', modeListener);
        break;
      case 'add-circle':
        container.classList.add('circle-mode');
        modeListener = ev => {
          const rect = container.getBoundingClientRect();
          insertCircle(ev.clientX-rect.left, ev.clientY-rect.top);
          cleanup();
        };
        container.addEventListener('click', modeListener);
        break;
      case 'undo':
        // implement undo if available
        break;
      case 'redo':
        break;
      case 'save':
        savePDF();
        break;
    }
  });

  // Help modal
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeHelp = document.getElementById('close-help');
  helpBtn && helpModal && helpBtn.addEventListener('click', ()=>helpModal.classList.add('active'));
  closeHelp && helpModal && closeHelp.addEventListener('click', ()=>helpModal.classList.remove('active'));

  // Signature modal close
  closeSignatureModal; // ensure function exists
});
