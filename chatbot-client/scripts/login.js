document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text(); // Read response as plain text
        // Store token in localStorage
        localStorage.setItem("token", token);

        // Redirect to ai.html
        window.location.href = "ai.html";
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

  // Check for token expiration
  const token = localStorage.getItem("token");
  if (token) {
    try {
      // Decode token to get expiration time
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

      if (Date.now() > expirationTime) {
        // Token has expired, logout user
        localStorage.removeItem("token");
        console.log("Token expired, user logged out");
      } else {
        // Token is still valid, redirect to ai.html
        window.location.href = "ai.html";
      }
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }
  }
});
