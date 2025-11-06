const registerform = document.getElementById("registerForm");
const noteForm = document.getElementById('noteForm')
const logoutBtn = document.getElementById("logout");

if (registerform) {
  registerform.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log(registerform);

    const userName = form.userName.value.trim();
    const password = form.password.value.trim();
    const confirmation = form.confirmation.value.trim();
    console.log(userName, password, confirmation);

    if (!userName || !password || !confirmation) {
      alert("All fields are required");
      return;
    }
    if (password !== confirmation) {
      alert("Password doesn't match your confirmation");
      return;
    }

    const formData = { userName, password };
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log(response.ok);
        const user = await response.json();
        console.log(user);
        form.reset();
        window.location.href = "/login";
      } else {
        const error = await response.json();
        throw new Error(`Error ${error}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.log(err);
    }
  });
}

