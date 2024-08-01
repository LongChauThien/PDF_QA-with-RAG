from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.storage import retrievalQA_storage, retriever_storage
router = APIRouter()

class Message(BaseModel):
    message: str
    id: str

@router.post("/chatbot")
async def chatbot(request: Message):
    try:
        if request.id not in list(retrievalQA_storage.keys()):
            raise HTTPException(status_code=404, detail="Retriever not found")
        else:
            qa = retrievalQA_storage[request.id]
            response = qa(request.message)
            return {"result": response['result']}
            # retriever = retriever_storage[request.id]
            # documents = list(retriever.get_relevant_documents(request.message))
            # docs_to_return = [
            #     {
            #         'metadata': doc.metadata,
            #         'page_content': doc.page_content
            #     }
            #     for doc in documents
            # ]
            # return {"result": docs_to_return}
        # return retriever_storage[retriever_id].get_relevant_documents(message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))