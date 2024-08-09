import React, {useState, useContext} from 'react';
import axios from 'axios';
import './Sidebar.css';
import { LoadingContext } from './LoadingContext';
import { FaArrowUp } from "react-icons/fa";

const Sidebar = () => {
    const [parameters, setParameters] = useState({
        chunkSize: 450,
        chunkOverlap: 200,
        kContext: 4,
        embeddingModel: "BAAI/bge-large-en",
        generativeModel: 'phi'
    });
    const [pdfFile, setPdfFile] = useState(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const handleParameterChange = (e) => {
        const {name, value} = e.target;
        setParameters(preParameters => ({
            ...preParameters,
            [name]: value
        }));
    }
    const handleFileChange = (e) => {
        const file  = e.target.files[0];
        setPdfFile(file);
    }

    const handleFileUpload = () => {
        if (pdfFile) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('pdf', pdfFile);
            Object.keys(parameters).forEach(key => {
                formData.append(key, parameters[key]);
            });
            axios.post('http://127.0.0.1:8000/api/v1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                setIsLoading(false);
                // console.log(response.data);
                sessionStorage.setItem('retriever_id', response.data.retriever_id);
                sessionStorage.setItem('llm_id', response.data.llm_id);
                sessionStorage.setItem('retrieval_qa_id', response.data.retrieval_qa_id);
                sessionStorage.setItem('file_name', response.data.file_name);
            }).catch(error => {
                setIsLoading(false);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                console.error('Error config:', error.config);
          });
        }
    };
    return (
        <div className="sidebar">
        <h2>Settings</h2>
        <div className="parameter">
          <label>Custom chunk size (200-800)</label>
          <input
            type="number"
            min="200"
            max="800"
            name="chunkSize"
            value={parameters.chunkSize}
            onChange={handleParameterChange}
          />
        </div>
        <div className="parameter">
          <label>Custom chunk overlap (0-200)</label>
          <input
            type="number"
            min="0"
            max="200"
            name="chunkOverlap"
            value={parameters.chunkOverlap}
            onChange={handleParameterChange}
          />
        </div>
        <div className="parameter">
          <label>k context (2-5)</label>
          <input
            type="number"
            min="2"
            max="5"
            name="kContext"
            value={parameters.kContext}
            onChange={handleParameterChange}
          />
        </div>
        <div className="parameter">
          <label>Model Embedding</label>
          <select
            name="embeddingModel"
            value={parameters.embeddingModel}
            onChange={handleParameterChange}
          >
            <option value="Model 1">BAAI/bge-large-en</option>
          </select>
        </div>
        <div className="parameter">
          <label>Model Generate</label>
          <select
            name="generativeModel"
            value={parameters.generativeModel}
            onChange={handleParameterChange}
          >
            <option value="phi">phi</option>
            <option value="mistral">mistral</option>
            <option value="llama3">llama3</option>
          </select>
        </div>
        <div className="parameter">
          <label>Upload PDF</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload
            <FaArrowUp className='icon'/>
            </button>
        </div>
      </div>
    );
};

export default Sidebar;