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
                // const response = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
                //     message: input
                // });
                // const botMessage = response.data[0].text;
                const botMessage = "Hello, I am a bot!";
                setMessages(preMessages => [...preMessages, {message: botMessage, sender: "bot"}]);
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
                <input
                    type="text"
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