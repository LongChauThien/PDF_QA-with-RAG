import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.retrievers import BM25Retriever, EnsembleRetriever
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader
from typing import Union, Dict, Any

def get_retriever( file_path: str, embedding_model: str, chunk_size: int=450, chunk_overlap: int=30, k_context: int=2) -> Union[EnsembleRetriever, Dict[str, Any]]:
    try:
        model_name = embedding_model
        # model_kwargs = {'device': 'cuda'}
        encode_kwargs = {'normalize_embeddings': False}
        embeddings = HuggingFaceBgeEmbeddings(
                    model_name=model_name,
                    # model_kwargs=model_kwargs,
                    encode_kwargs=encode_kwargs)
    except Exception as e:
        return {"message": "An error occurred when loading embedding model", "error": str(e)}
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
    except Exception as e:
        return {"message": "An error occurred when loading PDF file", "error": str(e)}
    
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        texts = text_splitter.split_documents(documents)
    except Exception as e:
        return {"message": "An error occurred when splitting documents", "error": str(e)}

    try:
        vector_store = Chroma.from_documents(texts, embeddings, collection_metadata={"hnsw:space": "cosine"})
        chroma_retriever = vector_store.as_retriever(search_kwargs={"k": k_context//2})
    except Exception as e:
        return {"message": "An error occurred when creating Chroma retriever", "error": str(e)}

    try:
        bm25_retriever = BM25Retriever.from_documents(texts)
        bm25_retriever.k = k_context//2
    except Exception as e:
        return {"message": "An error occurred when creating BM25 retriever", "error": str(e)}

    try:
        retriever_ensemble = EnsembleRetriever(retrievers=[bm25_retriever, chroma_retriever], weights=[0.25, 0.75])
    except Exception as e:
        return {"message": "An error occurred when creating ensemble retriever", "error": str(e)}

    return retriever_ensemble