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

    const intervalId = setInterval(fetchChatHistory, 10000);
    return () => clearInterval(intervalId);
  }, []);

  console.log("History data:", historyData);

  return (
    <div>
      <h1 className="history_chat_name" style={{ fontSize: 20 }}>
        History
      </h1>
      <div id="history">
        {historyData.map((history, index) => (
          <ChatCard
            key={index}
            history={history}
            historyName={
              history.questionAnswerPairs &&
              history.questionAnswerPairs.length > 0
                ? history.questionAnswerPairs[0].question
                : ""
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
