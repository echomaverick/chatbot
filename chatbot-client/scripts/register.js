// Check if token exists in localStorage
const token = localStorage.getItem("token");
if (token) {
  window.location.href = "ai.html"; // Redirect to ai.html if token exists
}

// Function to register a new user
function registerUser(event) {
  event.preventDefault();

  // Getting user input values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Creating user data object
  const userData = {
    name: name,
    email: email,
    username: username,
    password: password,
  };

  // Sending user data to the backend for registration
  axios
    .post("http://localhost:8080/api/users/register", userData)
    .then((response) => {
      alert("User registered successfully!");
      window.location.href = "ai.html"; // Redirect to ai.html after successful registration
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      alert("Error: " + error.message);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", registerUser);
});
