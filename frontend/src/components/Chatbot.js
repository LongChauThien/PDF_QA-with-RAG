import React, {useState} from "react";
import axios from "axios";
import Message from "./Message";
import "./Chatbot.css";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const sendMessage = async () => {
        if (input.trim()){
            setMessages(preMessages => [...preMessages, {message: input, sender: "user"}]);
            setInput("");
            try {
                const retrieval_qa_id = sessionStorage.getItem('retrieval_qa_id');
                const response = await axios.post('http://127.0.0.1:8000/api/v1/chatbot', {
                    message: input,
                    id: retrieval_qa_id
                });
                console.log(response.data);
                const botMessages = response.data.result
                setMessages(preMessages => [...preMessages, {message: botMessages, sender: "bot"}]);
                // const botMessages = response.data.result.map(doc => ({
                //     metadata: doc.metadata,
                //     page_content: doc.page_content
                // }));
            
                // setMessages(preMessages => [...preMessages, ...botMessages.map(message => ({message: message.page_content, sender: "bot"}))]);
                // console.log("from bot",messages);
            }
            catch (error) {
                console.log(error);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };
    return (
        <div className="chatbot-container">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg.message} sender={msg.sender} />
                ))}
            </div>
            <div className="input-container">
                <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
      );
};

export default Chatbot;