
const input = document.getElementById("file-input");
const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");
const wrapper = document.getElementById("pdf-wrapper");
const sigCanvas = document.getElementById("sig-canvas");
const sigCtx = sigCanvas.getContext("2d");
const sigBox = document.getElementById("signature-box");
let page = null, scale = 1.5;
let drawing = false, signatureImage = null;
let annotateMode = false;
let annotations = [];

input.addEventListener("change", () => {
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const typedArray = new Uint8Array(reader.result);
    pdfjsLib.getDocument({ data: typedArray }).promise.then(doc => {
      doc.getPage(1).then(p => {
        page = p;
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.render({ canvasContext: ctx, viewport });
      });
    });
  };
  reader.readAsArrayBuffer(file);
});

function activateAnnotateMode() {
  annotateMode = true;
}

wrapper.addEventListener("click", (e) => {
  if (!annotateMode) return;
  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const div = document.createElement("div");
  div.contentEditable = true;
  div.className = "annotation";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.minWidth = "40px";
  div.style.minHeight = "20px";
  div.style.borderBottom = "1px dashed gray";
  wrapper.appendChild(div);
  annotations.push(div);
  annotateMode = false;
});

function openSignature() {
  sigBox.style.display = "block";
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  sigCanvas.onmousedown = e => {
    drawing = true;
    sigCtx.beginPath();
    sigCtx.moveTo(e.offsetX, e.offsetY);
  };
  sigCanvas.onmousemove = e => {
    if (drawing) {
      sigCtx.lineTo(e.offsetX, e.offsetY);
      sigCtx.stroke();
    }
  };
  sigCanvas.onmouseup = () => drawing = false;
}

function saveSignature() {
  signatureImage = new Image();
  signatureImage.src = sigCanvas.toDataURL();
  signatureImage.onload = () => {
    ctx.drawImage(signatureImage, 100, 100, 150, 40);
    sigBox.style.display = "none";
  };
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.addImage(canvas.toDataURL(), "PNG", 0, 0, canvas.width * 0.264583, canvas.height * 0.264583);
  annotations.forEach(ann => {
    const x = parseFloat(ann.style.left) * 0.264583;
    const y = parseFloat(ann.style.top) * 0.264583;
    pdf.setFont("Arial");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(ann.innerText, x, y);
  });
  pdf.save("signed.pdf");
}
