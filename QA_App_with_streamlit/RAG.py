from langchain import PromptTemplate, LLMChain
from langchain.llms import CTransformers
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.retrievers import BM25Retriever, EnsembleRetriever
from langchain.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

def get_embedding():
    model_name = "BAAI/bge-large-en"
    model_kwargs = {'device': 'cuda'}
    encode_kwargs = {'normalize_embeddings': False}
    embeddings = HuggingFaceBgeEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )
    return embeddings
def load_file(path):
    loader = PyPDFLoader(path)
    documents = loader.load()
    return documents

def create_retriever(path,embedding,chunk_size,chunk_overlap,k_contexts):
    documents = load_file(path)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    texts = text_splitter.split_documents(documents)
    vector_store = Chroma.from_documents(texts, embedding, collection_metadata={"hnsw:space": "cosine"})
    retriever = vector_store.as_retriever(search_kwargs={"k": k_contexts})

    documents_2 = load_file(path)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    docs = text_splitter.split_documents(documents_2)
    bm25_retriever = BM25Retriever.from_documents(docs)
    bm25_retriever.k = k_contexts


    retriever_ensemble = EnsembleRetriever(retrievers=[bm25_retriever, retriever], weights=[0.5, 0.5])
    return retriever_ensemble

def create_LLM():
    callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
    n_gpu_layers = 50
    n_batch = 512

    llm = LlamaCpp(
        model_path="../zephyr-7b-beta.Q4_K_M.gguf",
        n_gpu_layers=n_gpu_layers,
        n_batch=n_batch,
        callback_manager=callback_manager,
        verbose=True,
        n_ctx=2048
    )
    return llm
def create_RetrievalQA(path,llm,embedding,chunk_size,chunk_overlap,k_contexts):
    retriever = create_retriever(path,embedding,chunk_size,chunk_overlap,k_contexts)
    prompt_template = """Use the following pieces of information to answer the user's question.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.

    Context: {context}
    Question: {question}

    Only return the helpful answer below and nothing else.
    Helpful answer:
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])

    chain_type_kwargs = {"prompt": prompt}

    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, chain_type_kwargs=chain_type_kwargs, verbose=True)
    return qa

def get_response(qa,input):
  try:
    response = qa(input)
    result =  response['result']
    return result
  except:
    return ''