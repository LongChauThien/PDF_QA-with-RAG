import React, {useState, useEffect} from "react";
import "./Header.css";  

sessionStorage.setItem('file_name', '');
const Header = () => {
    const [fileName,setFileName] = useState(sessionStorage.getItem('file_name'));

    useEffect(() => {
        const handleStorageChange = () => {
            setFileName(sessionStorage.getItem('file_name'));
        };
        setInterval(handleStorageChange, 5000);
    }, []);

    return (
        <div className="header-container">
            <div className="app-name">
                <h1>PDF Chatbot</h1>
                <p style={{fontStyle:"italic"}}>Ask questions about your PDF documents</p>
            </div>
            <div className="title">
                <h1>{fileName}</h1>
            </div>
        </div>
    );
}

export default Header;  