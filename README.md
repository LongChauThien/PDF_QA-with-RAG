# PDF_QA with RAG
## Overview
PDF_QA with RAG is a project that leverages Retrieval-Augmented Generation (RAG) to build a robust question-answering system for PDF documents. The project integrates a FastAPI backend, a React frontend, and a Streamlit app for different aspects of the application.

## Backend
The backend is built with FastAPI and provides endpoints for:

Chatbot Interactions: Handling user queries and generating responses.
File Uploads: Uploading and processing PDF documents.
### Installation
1. Navigate to the backend/ directory.
2. Install the required packages:
```bash
    pip install -r requirements.txt
```
### Running the Backend
1. Navigate to the backend/ directory.
2. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
## Frontend
The frontend is a React application providing the user interface for interacting with the backend.

### Installation
1. Navigate to the frontend/ directory.
2. Install the required packages:
```bash
npm install
```
### Running the Frontend
1. Navigate to the frontend/ directory.
2. Start the React development server:
```bash
npm start
```
## Streamlit App
The Streamlit app provides an interactive interface for the question-answering system.

### Installation
1. Navigate to the QA_App_with_streamlit/ directory.
2. Install the required packages:
```bash
pip install -r requirements.txt
```
### Running the Streamlit App
1. Navigate to the QA_App_with_streamlit/ directory.
2. Start the Streamlit server:
```bash
streamlit run QA_App.ipynb
```
## Data
Kết quả thực nghiệm/: Contains experimental results in Excel format.
Ngữ liệu.xlsx: Dataset used in the project.
## Jupyter Notebook
pipeline.ipynb: Jupyter Notebook for data processing and RAG model experimentation.
## Project Report
Project_report.docx: Detailed report on the project implementation and results
