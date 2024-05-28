import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatCard from "./ChatCard";

const ChatHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login.html";
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUsername(decodedToken.sub);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/history/username/${decodedToken.sub}`
        );
        if (response.status === 200) {
          setHistoryData(response.data);
        } else {
          console.error("Failed to fetch chat history.");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <div>
      <h1>Chat History for {username}</h1>
      <div id="history">
        {historyData.map((history, index) => (
          <ChatCard key={index} history={history} />
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
