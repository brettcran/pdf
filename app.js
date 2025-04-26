
const input = document.getElementById("file-input");
const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");
const sigCanvas = document.getElementById("sig-canvas");
const sigCtx = sigCanvas.getContext("2d");
const sigBox = document.getElementById("signature-box");
let pdf = null, page = null, scale = 1.5;
let drawing = false, signatureImage = null;

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

function annotatePDF() {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Annotation Here", 50, 50);
}

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
  pdf.save("signed.pdf");
}
