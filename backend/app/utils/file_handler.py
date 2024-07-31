import os
from fastapi import File, UploadFile

UPLOAD_DIRECTORY = os.path.join("app","upload_files")


def save_file(file: UploadFile):
    try:
        if not os.path.exists(UPLOAD_DIRECTORY):
            os.makedirs(UPLOAD_DIRECTORY)
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        return {"message": "File uploaded successfully", "file_location": file_location}
    except Exception as e:
        return {"message": "An error occurred", "error": str(e)}
    