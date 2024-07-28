import React, {useState} from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
    const [parameters, setParameters] = useState({
        parameter1: '',
        parameter2: '',
        selectedModel: 'Model 1'
    });
    const [pdfFile, setPdfFile] = useState(null);

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
            const formData = new FormData();
            formData.append('pdf', pdfFile);
            axios.post('http://127.0.0.1:8000/api/v1/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                console.log(response.data);
            }).catch(error => {
                console.log(error);
            });
        }
    };
    return (
        <div className="sidebar">
        <h2>Settings</h2>
        <div className="parameter">
          <label>Custom Parameter 1</label>
          <input
            type="text"
            name="parameter1"
            value={parameters.parameter1}
            onChange={handleParameterChange}
          />
        </div>
        <div className="parameter">
          <label>Custom Parameter 2</label>
          <input
            type="text"
            name="parameter2"
            value={parameters.parameter2}
            onChange={handleParameterChange}
          />
        </div>
        <div className="parameter">
          <label>Select Model</label>
          <select
            name="selectedModel"
            value={parameters.selectedModel}
            onChange={handleParameterChange}
          >
            <option value="Model 1">Model 1</option>
            <option value="Model 2">Model 2</option>
            <option value="Model 3">Model 3</option>
          </select>
        </div>
        <div className="parameter">
          <label>Upload PDF</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload</button>
        </div>
      </div>
    );
};

export default Sidebar;