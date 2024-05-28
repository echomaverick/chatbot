import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import send from "../assets/send.svg";
import "../styles/ai.css";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const AiChat = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

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
      const uniqueId = generateUniqueId();
      const loaderInterval = loader(uniqueId);

      const response = await axios.post("http://localhost:8080/api/ask", {
        question: userInput,
      });

      setIsLoading(false);

      clearInterval(loaderInterval);

      if (response.status === 200) {
        const responseData = response.data;
        const answerContent = responseData.answer.map((a) => a.content);

        const answerMessage = {
          content: answerContent.join("\n"),
          isUser: false,
        };

        setChatMessages((prevMessages) => [...prevMessages, answerMessage]);

        const username = getUsernameFromToken();
        const historyData = {
          username,
          question: userInput,
          answer: Array.isArray(answerContent)
            ? answerContent
            : [answerContent],
        };
        localStorage.setItem("historyData", JSON.stringify(historyData));

        const responseHistory = await axios.post(
          "http://localhost:8080/api/history",
          historyData
        );
        console.log("Response from backend:", responseHistory.data);
      } else {
        console.error("Error: ", response.statusText);
      }
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

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };

  const chatStripe = (isAi, value, uniqueId) => {
    return (
      <div
        key={uniqueId}
        id={uniqueId}
        className={`wrapper ${isAi ? "ai" : "user"}`}
      >
        <div className="chat">
          <div className="profile">
            <img src={!isAi ? bot : user} alt={isAi ? "bot" : "user"} />
          </div>
          <div className="message">{value}</div>
        </div>
      </div>
    );
  };

  const loader = (uniqueId) => {
    const messageDiv = document.getElementById(uniqueId);
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
    <div id="app">
      <div id="chat_container" ref={chatContainerRef}>
        {chatMessages.map((message, index) => {
          const uniqueId = generateUniqueId();
          return chatStripe(message.isUser, message.content, uniqueId);
        })}

        {isLoading && (
          <Box
            sx={{
              width: 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: "30px",
              marginTop: "10px",
            }}
          >
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              width={500}
              height={20}
              sx={{
                borderRadius: "4px",
                backgroundSize: "600% 600%",
                animation: "skeletonGradient 4s infinite alternate",
              }}
            />
          </Box>
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
  );
};

export default AiChat;
