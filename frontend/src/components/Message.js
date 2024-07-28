import React from 'react';

const Message = ({message, sender}) => {
    return (
        <div className={`message ${sender === 'bot' ? 'bot-message' : 'user-message'}`}>
            {message}
        </div>
    );
}

export default Message;