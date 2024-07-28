import React from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/Chatarea";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
}

export default App;
