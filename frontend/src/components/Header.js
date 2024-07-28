import React from "react";
import "./Header.css";  

const Header = () => {
    return (
        <div className="header-container">
            <div className="app-name">
                <h1>PDF Chatbot</h1>
                <p>Ask questions about your PDF documents</p>
            </div>
            <div className="title">
                <h1>File name: abcxyz.pdf</h1>
            </div>
        </div>
    );
}

export default Header;  