import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatHistory from "./components/ChatHistory";
import HistoryDetail from "./components/HistoryDetail";
import AiChat from "./components/AiChat";
import LoginScript from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginScript />} />
          <Route
            path="/history"
            element={
              isAuthenticated() ? (
                <ChatHistory />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/history/:id"
            element={
              isAuthenticated() ? (
                <HistoryDetail />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/ai"
            element={
              isAuthenticated() ? <AiChat /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
