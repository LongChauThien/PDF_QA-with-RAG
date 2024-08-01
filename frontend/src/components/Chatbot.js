import React, {useState, useEffect, useRef, useContext} from "react";
import axios from "axios";
import Message from "./Message";
import { LoadingContext } from "./LoadingContext";
import "./Chatbot.css";
import { FaArrowUp } from "react-icons/fa";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);
    const messagesEndRef = useRef(null);
    const { isLoading } = useContext(LoadingContext);
    const sendMessage = async () => {
        if (input.trim()){
            setIsWaiting(true);
            setMessages(preMessages => [...preMessages, {message: input, sender: "user"}]);
            setInput("");
            try {
                const retrieval_qa_id = sessionStorage.getItem('retrieval_qa_id');
                const retriever_id = sessionStorage.getItem('retriever_id');
                const response = await axios.post('http://127.0.0.1:8000/api/v1/chatbot', {
                    message: input,
                    id: retrieval_qa_id
                });
                setIsWaiting(false);
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
                setIsWaiting(false);
                setMessages(preMessages => [...preMessages, {message: "Please upload the file and wait for processing", sender: "bot"}]);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        if (isLoading) {
            setMessages([]); // Clear messages when loading
        }
    }, [isLoading]);

    return (
        <div className="chatbot-container">
            <div className="messages-container">
            {isLoading ? (<div className="loader-container"><span className="loader"></span><div className="text">Waiting for loading model and processing pdf...</div></div>): null}
                {messages.map((msg, index) => (
                    <Message key={index} message={msg.message} sender={msg.sender} />
                ))}
                {isWaiting ? <Message message="" sender="bot" isWaiting={isWaiting} /> : null}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="  Type your message..."
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading}>
                <FaArrowUp />
                </button>
            </div>
        </div>
      );
};

export default Chatbot;