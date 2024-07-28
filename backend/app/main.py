from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

UPLOAD_DIRECTORY = "app/upload_files"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post("/api/v1/upload/")
async def upload_file(pdf: UploadFile = File(...)):
    try:
        file_location = f"{UPLOAD_DIRECTORY}/{pdf.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(pdf.file.read())
        return JSONResponse(content={"message": "File uploaded successfully", "file_location": file_location})
    except Exception as e:
        return JSONResponse(content={"message": "An error occurred", "error": str(e)})