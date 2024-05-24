import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import axios from "axios";

// Selecting DOM elements
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

// Function to display a loading animation
let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 100);
}

// Function to simulate typing effect
const typeText = async (messageDiv, element, text, typingSpeed) => {
  for (let i = 0; i < text.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    element.innerHTML += text.charAt(i);
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }
};

// Function to generate a unique ID for messages
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// Function to create a chat message stripe
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

// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Getting user input
  const formData = new FormData(form);
  const userPrompt = formData.get("prompt");

  // Displaying user message in chat
  chatContainer.innerHTML += chatStripe(false, userPrompt);
  form.reset();

  // Displaying AI typing indicator
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  try {
    // Sending user input to backend for processing
    const response = await axios.post("http://localhost:8080/api/ask", {
      question: userPrompt,
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    // Handling response from backend
    if (response.status === 200) {
      const responseData = response.data;

      // Checking response format and displaying content
      if (
        responseData.hasOwnProperty("answer") &&
        Array.isArray(responseData.answer)
      ) {
        for (const answer of responseData.answer) {
          if (answer.hasOwnProperty("content")) {
            const paragraph = document.createElement("p");
            const content = answer.content;
            const typedText = document.createElement("span");
            paragraph.appendChild(typedText);
            messageDiv.appendChild(paragraph);
            await typeText(messageDiv, typedText, content, 10);

            // Adding links to URLs in the content
            const contentWithLinks = content.replace(
              /(https?:\/\/[^\s]+)/g,
              '<a href="$1" target="_blank">$1</a>'
            );
            paragraph.innerHTML = contentWithLinks;
          }
        }
      } else {
        messageDiv.innerHTML = "Unexpected response format";
      }
    } else {
      // Handling error responses
      messageDiv.innerHTML = response.data.error || "Something went wrong";
      alert("Error: " + response.statusText);
    }
  } catch (error) {
    console.error(error);
    messageDiv.innerHTML = "Something went wrong";
    alert("Error: " + error.message);
  }

  // Auto-scrolling chat container to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Event listeners for form submission and Enter key press
form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
