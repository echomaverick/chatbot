import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import axios from "axios";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = decodedToken.exp * 1000;

      if (Date.now() > expirationTime) {
        localStorage.removeItem("token");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return false;
    }
  } else {
    return false;
  }
};

// Function to get the username from the token
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

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

const typeText = async (messageDiv, element, text, typingSpeed) => {
  for (let i = 0; i < text.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    element.innerHTML += text.charAt(i);
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }
};

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
        <div class="chat">
            <div class="profile">
                <img 
                  src=${isAi ? bot : user} 
                  alt="${isAi ? "bot" : "user"}" 
                />
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
        </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAuthenticated()) {
    window.location.href = "/login.html";
    return;
  }

  const formData = new FormData(form);
  const userPrompt = formData.get("prompt");

  chatContainer.innerHTML += chatStripe(false, userPrompt);
  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  try {
    const response = await axios.post("http://localhost:8080/api/ask", {
      question: userPrompt,
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if (response.status === 200) {
      const responseData = response.data;
      const answerContent = responseData.answer.map((a) => a.content);

      for (const content of answerContent) {
        const paragraph = document.createElement("p");
        const typedText = document.createElement("span");
        paragraph.appendChild(typedText);
        messageDiv.appendChild(paragraph);
        await typeText(messageDiv, typedText, content, 10);

        const contentWithLinks = content.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank">$1</a>'
        );
        paragraph.innerHTML = contentWithLinks;
      }

      localStorage.setItem("userQuestion", userPrompt);
      localStorage.setItem("aiAnswer", JSON.stringify(answerContent));
      const username = getUsernameFromToken();
      localStorage.setItem("username", username);

      await axios.post("http://localhost:8080/api/save-history", {
        username,
        question: userPrompt,
        answer: answerContent,
      });
    } else {
      messageDiv.innerHTML = response.data.error || "Something went wrong";
      alert("Error: " + response.statusText);
    }
  } catch (error) {
    console.error(error);
    messageDiv.innerHTML = "Something went wrong";
    alert("Error: " + error.message);
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
