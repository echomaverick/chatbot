import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatCard from "./ChatCard";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const CHAT_HISTORY_KEY = "chat_history";
const FETCH_TIMEOUT = 5000;
const ChatHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [timeoutErrorLogged, setTimeoutErrorLogged] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsFetching(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const username = decodedToken.sub;

        const response = await axios.get(
          `http://localhost:8080/api/history/username/${username}`
        );
        if (response.status === 200) {
          const data = response.data;
          setHistoryData(data);
          localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(data));
        } else {
          setError("Failed to fetch chat history. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error.message);
        setError("Error fetching chat history. Please try again later.");
      } finally {
        setIsFetching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isFetching) {
        console.error("Network error: Chat history retrieval timed out.");
        setIsFetching(false);
        setTimeoutErrorLogged(true);
      }
    }, FETCH_TIMEOUT);

    fetchChatHistory();

    return () => {
      clearTimeout(timeoutId);
      setIsFetching(false);
    };
  }, []);

  const handleDeleteHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const username = decodedToken.sub;

      const response = await axios.delete(
        `http://localhost:8080/api/history/delete/${username}`
      );

      if (response.status === 204) {
        setHistoryData([]);
        localStorage.removeItem(CHAT_HISTORY_KEY);
        setShowModal(false);
      } else {
        setError("Failed to delete chat history. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting chat history:", error.message);
      setError("Error deleting chat history. Please try again later.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div style={{ paddingBottom: "50px" }}>
      <h1 className="history_chat_name" style={{ fontSize: 20 }}>
        History
      </h1>
      <div id="history">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!error &&
          historyData.map((history, index) => (
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
        {isFetching &&
          !timeoutErrorLogged &&
          console.error("Network error: Chat history retrieval timed out.")}
      </div>
      <Button
        style={{
          padding: 10,
          borderRadius: 20,
          position: "fixed",
          bottom: "50px",
          transform: "translateX(-50%)",
          zIndex: "1000",
        }}
        variant="danger"
        onClick={handleShowModal}
      >
        Delete History
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your chat history?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteHistory}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatHistory;
