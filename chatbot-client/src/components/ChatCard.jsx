import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/history.css";

const ChatCard = ({ historyName, history }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/history/${history.id}`);
  };

  return (
    <div className="history-card" onClick={handleClick}>
      <h3 className="history_name" style={{ color: "white", fontSize: 15 }}>
        {historyName}
      </h3>
    </div>
  );
};

export default ChatCard;
