import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/history.css";

const ChatCard = ({ history }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(history);
    navigate(`/history/${history.id}`);
  };

  return (
    <div className="history-card" onClick={handleClick}>
      <h3>{history.question}</h3>
    </div>
  );
};

export default ChatCard;
