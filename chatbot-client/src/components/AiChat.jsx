import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import send from "../assets/send.svg";
import "../styles/ai.css";
import "../styles/skeleton.css";
import "../styles/menu.css";
import ChatHistory from "./ChatHistory";

const generateSessionId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

const AiChat = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        return Date.now() < expirationTime;
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    const message = { content: userInput, isUser: true };
    setChatMessages((prevMessages) => [...prevMessages, message]);
    setUserInput("");

    try {
      const loaderInterval = loader();
      try {
        await axios.get("http://localhost:8080/api/ping");
      } catch (error) {
        setIsLoading(false);
        const errorMessage = "Error: Check your internet connection.";
        setTimeout(() => {
          const errorResponse = {
            content: errorMessage,
            isUser: false,
          };
          setChatMessages((prevMessages) => [...prevMessages, errorResponse]);
          setIsLoading(false);
        }, 5000);
        return;
      }

      let response;
      try {
        response = await axios.post("http://localhost:8080/api/ask", {
          sessionId: sessionId,
          username: getUsernameFromToken(),
          question: userInput,
        });

        if (response.status === 200) {
          const responseData = response.data;
          const answerContent = responseData.answer.map((a) => a.content);

          const answerMessage = {
            content: answerContent.join("\n"),
            isUser: false,
          };

          setChatMessages((prevMessages) => [...prevMessages, answerMessage]);

          const historyData = {
            sessionId: sessionId,
            username: getUsernameFromToken(),
            questionAnswerPairs: [
              {
                question: userInput,
                answer: Array.isArray(answerContent)
                  ? answerContent
                  : [answerContent],
              },
            ],
          };

          await axios.post("http://localhost:8080/api/history", historyData);
        } else {
          console.error("Error: ", response.statusText);
        }
      } catch (error) {
        console.error("Error: ", error.message);
        const errorMessage = "Error: Something went wrong.";
        const errorResponse = {
          content: errorMessage,
          isUser: false,
        };
        setChatMessages((prevMessages) => [...prevMessages, errorResponse]);
      }

      setIsLoading(false);
      clearInterval(loaderInterval);
    } catch (error) {
      console.error("Error: ", error.message);
      setIsLoading(false);
    }
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const loader = () => {
    const messageDiv = document.getElementById("loader");
    if (!messageDiv) return;
    messageDiv.textContent = "";
    let counter = 0;
    const loaderInterval = setInterval(() => {
      messageDiv.textContent += ".";
      counter++;
      if (counter === 4) {
        counter = 0;
        messageDiv.textContent = "";
      }
    }, 300);

    return loaderInterval;
  };

  const typeText = async (messageDiv, text, typingSpeed) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, typingSpeed));
      messageDiv.textContent += text.charAt(i);
      scrollToBottom();
    }
  };

  const handleFormSubmit = (e) => {
    handleSubmit(e);
  };

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken.sub;
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return null;
      }
    }
    return null;
  };

  return (
    <div className="sideb-bar-container">
      <div className="sidebar" style={{ width: 250 }}>
        {!showSidebar && (
          <ChatHistory
            sessionId={sessionId}
            username={getUsernameFromToken()}
            navigate={navigate}
          />
        )}
      </div>
      <div id="app" className="main-content">
        <div
          id="chat_container"
          ref={chatContainerRef}
          style={{ flex: 1, overflowY: "auto" }}
        >
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`wrapper ${!message.isUser ? "ai" : "user"}`}
            >
              <div className="chat">
                <div className="profile">
                  <img src={!message.isUser ? bot : user} alt="bot" />
                </div>
                <div className="message">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div id="skeleton-loader" className="skeleton-loader">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          )}
        </div>
        <form onSubmit={handleFormSubmit}>
          <textarea
            name="prompt"
            rows="1"
            cols="1"
            placeholder="Ask InsightAi..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyUp={handleKeyUp}
          ></textarea>
          <button type="submit">
            <img src={send} alt="Send" />
          </button>
        </form>
        <p className="info-text">
          InsightAi can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default AiChat;
