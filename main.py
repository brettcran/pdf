from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import FileResponse
import shutil
import os

app = FastAPI()

@app.post("/annotate-pdf")
async def annotate_pdf(pdf: UploadFile, annotations: str = Form(...)):
    temp_input = "/tmp/input.pdf"
    temp_output = "/tmp/annotated_output.pdf"

    with open(temp_input, "wb") as buffer:
        shutil.copyfileobj(pdf.file, buffer)

    # For demo: just pass through original file (no real annotation yet)
    shutil.copyfile(temp_input, temp_output)

    return FileResponse(temp_output, media_type="application/pdf", filename="annotated_output.pdf")
