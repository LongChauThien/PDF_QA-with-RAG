from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.utils.file_handler import save_file
from app.services.retriever import get_retriever
from app.services.generate import get_llm
from app.services.retrievalQA import get_retriever_qa
from app.storage import retriever_storage, llm_storage, retrievalQA_storage

router = APIRouter()

@router.post("/upload")
async def upload_file(
    pdf: UploadFile = File(...),
    chunkSize: int = Form(...),
    chunkOverlap: int = Form(...),
    kContext: int = Form(...),
    embeddingModel: str = Form(...),
    generativeModel: str = Form(...)):
    try:
        response = save_file(pdf)
        if response["message"] == "File uploaded successfully":
            retriever = get_retriever(
                file_path=response["file_location"],
                embedding_model=embeddingModel,
                chunk_size=chunkSize,
                chunk_overlap=chunkOverlap,
                k_context=kContext
            )
            if isinstance(retriever, dict):
                return {"message": retriever["message"], "error": retriever["error"]}
            else:
                retriever_id = str(id(retriever))
                retriever_storage[retriever_id] = retriever

                llm = get_llm(generativeModel)
                if isinstance(llm, dict):
                    return {"message": llm["message"], "error": llm["error"]}
                else:
                    llm_id = str(id(llm))
                    llm_storage[llm_id] = llm

                    retrieval_qa = get_retriever_qa(llm=llm, retriever=retriever)
                    if isinstance(retrieval_qa, dict):
                        return {"message": retrieval_qa["message"], "error": retrieval_qa["error"]}
                    else:
                        retrieval_qa_id = str(id(retrieval_qa))
                        retrievalQA_storage[retrieval_qa_id] = retrieval_qa
                    return {"retriever_id": retriever_id,"llm_id": llm_id,"retrieval_qa_id": retrieval_qa_id,"file_name":response["file_name"]}
        else:
            raise HTTPException(status_code=500, detail=response.message)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))