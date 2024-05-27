import axios from "axios";

document.addEventListener("DOMContentLoaded", async function () {
    function isAuthenticated() {
        const token = localStorage.getItem("token");
        return token !== null;
    }

    // Function to get the username from the token
    function getUsernameFromToken() {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            return decodedToken.sub;
        }
        return null;
    }

    async function displayChatHistory() {
        if (!isAuthenticated()) {
            window.location.href = "/login.html";
            return;
        }

        const username = getUsernameFromToken();
        if (!username) {
            console.error("Failed to get username from token.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/history-by-username/${username}`);

            if (response.status === 200) {
                const historyData = response.data;
                const chatContainer = document.getElementById("chat-container");
                chatContainer.innerHTML = "";

                historyData.forEach((history) => {
                    const historyCard = document.createElement("div");
                    historyCard.className = "history-card";

                    const userMessage = document.createElement("h3");
                    userMessage.innerText = history.question;

                    const answerList = document.createElement("ul");
                    history.answer.forEach((answer) => {
                        const answerItem = document.createElement("li");
                        answerItem.innerText = answer;
                        answerList.appendChild(answerItem);
                    });

                    historyCard.appendChild(userMessage);
                    historyCard.appendChild(answerList);

                    chatContainer.appendChild(historyCard);
                });
            } else {
                console.error("Failed to fetch chat history.");
                alert("Error: " + response.statusText);
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    }

    displayChatHistory();
});
