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

  return (
    <div className="history-detail">
      {history.questionAnswerPairs.map((pair, index) => (
        <div key={index}>
          <h1 className="title">{pair.question}</h1>
          <p className="bot-message">{pair.answer.join(" ")}</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryDetail;
