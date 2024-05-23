import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import axios from "axios";

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
  }, 100);
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
