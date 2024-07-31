from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.retrievers import EnsembleRetriever
from langchain_community.llms import Ollama
from typing import Dict, Any, Union

def get_retriever_qa(llm: Ollama, retriever: EnsembleRetriever) -> Union[RetrievalQA, Dict[str, Any]]:
    prompt_template = """Use the following pieces of information to answer the user's question.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.

    Context: {context}
    Question: {question}

    Only return the helpful answer below and nothing else.
    Helpful answer:
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])

    chain_type_kwargs = {"prompt": prompt}

    try:
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=False, chain_type_kwargs=chain_type_kwargs, verbose=False)
    except Exception as e:
        return {"message": "An error occurred when creating RetrievalQA", "error": str(e)}
    
    return qa