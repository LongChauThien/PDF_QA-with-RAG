import React from "react";
import { LoadingProvider } from "./components/LoadingContext";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/Chatarea";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <LoadingProvider>
    <div className="app-container">
      <Header />
      <div className="main-container">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
    </LoadingProvider>
  );
}

export default App;
