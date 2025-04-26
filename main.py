from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "PDFill-Sign backend is running"}
