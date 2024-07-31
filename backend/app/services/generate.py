from langchain_community.llms import Ollama
from typing import Union, Dict, Any

def get_llm(generative_model: str) -> Union[Ollama, Dict[str, Any]]:
    try:
        llm = Ollama(model=generative_model)
    except Exception as e:
        return {"message": "An error occurred when loading generative model", "error": str(e)}
    return llm