import streamlit as st
from streamlit_extras.add_vertical_space import add_vertical_space
from pathlib import Path
import RAG 

st.set_page_config(
    page_title='QA_App for PDF',
    page_icon='🔖',
    layout='wide',
    initial_sidebar_state='auto',
)
st.header('Chat with your PDF')

def clear_history():
    if 'RetrievalQA' in st.session_state:
        del st.session_state['RetrievalQA']

with st.sidebar:
    st.title('Open Source LLM QA App')
    add_vertical_space(4)

    pdf = st.file_uploader('Upload your PDF here',type='pdf')
    chunk_size = st.number_input('Chunk size:',min_value=200,max_value=800,on_change=clear_history)
    chunk_overlap = st.number_input('Chunk overlap:',min_value=0,max_value=200,on_change=clear_history)
    k_contexts = st.number_input('k contexts:',min_value=1,max_value=5,on_change=clear_history)
    add_data = st.button('Add data',on_click=clear_history)

with st.spinner("Loading llm...."):
    if 'llm' not in st.session_state:
        llm = RAG.create_LLM()
        st.session_state['llm'] = llm
st.success('Loading LLM Done!')

with st.spinner("Loading embedding model...."):
    if 'embedding' not in st.session_state:
        embedding = RAG.get_embedding()
        st.session_state['embedding'] = embedding
st.success('Loading embedding Done!')


def main():
    if pdf!=None and add_data:
        with st.spinner("Reading file and processing...."):
            save_folder = './data'
            save_path = Path(save_folder, pdf.name)
            with open(save_path, mode='wb') as w:
                w.write(pdf.getvalue())
            path = './data/'+pdf.name
            if 'llm' in st.session_state and 'embedding' in st.session_state:
                RetrievalQA = RAG.create_RetrievalQA(path,st.session_state.llm,st.session_state.embedding,chunk_size,chunk_overlap,k_contexts)
                st.session_state['RetrievalQA'] = RetrievalQA
        st.success('Reading file and processing Done!')
    query = st.text_input('Ask question about your pdf file:')
    value = ''
    if query:
        if 'RetrievalQA' not in st.session_state:
            value = 'Add your pdf file first and wait for a while!'
            query = ''
        else:
            try:
              value = RAG.get_response(st.session_state.RetrievalQA,query)
            except:
              value = ''
        st.text_area('Answer:',value=value,height=300)

if __name__ == '__main__':
    main()