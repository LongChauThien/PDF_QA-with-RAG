import React from 'react';
import './Message.css';

const Message = ({message, sender, isWaiting=false}) => {
    return (
        <div className={`message ${sender === 'bot' ? 'bot' : 'user'}`}>
            {message}
            {isWaiting && <div className="loader10"></div>}
        </div>
    );
}

export default Message;