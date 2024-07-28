import React from 'react';
import './Message.css';

const Message = ({message, sender}) => {
    return (
        <div className={`message ${sender === 'bot' ? 'bot' : 'user'}`}>
            {message}
        </div>
    );
}

export default Message;