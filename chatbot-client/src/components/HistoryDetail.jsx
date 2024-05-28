import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/history.css";

const HistoryDetail = () => {
  const { id } = useParams();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchHistoryDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/history/${id}`
        );
        if (response.status === 200) {
          setHistory(response.data);
        } else {
          console.error("Failed to fetch history details.");
        }
      } catch (error) {
        console.error("Error fetching history details:", error);
      }
    };

    fetchHistoryDetail();
  }, [id]);

  if (!history) {
    return <p>Loading...</p>;
  }
  const answerText = history.answer.join(" ");

  return (
    <div className="history-detail">
      <h1 className="title">{history.question}</h1>
      <p className="bot-message">{answerText}</p>
    </div>
  );
};

export default HistoryDetail;