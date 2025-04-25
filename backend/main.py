from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
import shutil

app = FastAPI()

@app.post("/annotate-pdf")
async def annotate_pdf(pdf: UploadFile, annotations: str = Form(...)):
    output_path = "/tmp/annotated_output.pdf"
    with open(output_path, "wb") as buffer:
        shutil.copyfileobj(pdf.file, buffer)
    return FileResponse(output_path, media_type="application/pdf", filename="annotated_output.pdf")
