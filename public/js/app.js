const registerform = document.getElementById("registerForm");
const noteForm = document.getElementById("noteForm");
const logoutBtn = document.getElementById("logout");
const deleteBtn = document.getElementById("delete");
const changePswForm = document.getElementById("changePswForm");
const loginForm = document.getElementById('loginForm')

if (registerform) {
  registerform.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log(registerform);

    const userName = registerform.userName.value.trim();
    const password = registerform.password.value.trim();
    const confirmation = registerform.confirmation.value.trim();
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
        registerform.reset();
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

if (noteForm) {
  noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = noteForm.title.value.trim();
    const description = noteForm.description.value.trim();

    if (!title || !description) {
      alert("all fields are required");
      return;
    }
    const formData = { title, description };
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const note = await response.json();
        noteForm.reset();
        window.location.href = "/dashboard";
      } else {
        const error = await response.json();
        throw new Error(`Error ${error}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });
}

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (response.ok) window.location.href = "/register";
    } catch (error) {
      console.log(error);
    }
  });
}

if (changePswForm) {
  changePswForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentPsw = changePswForm.currentPsw.value.trim();
    const newPsw = changePswForm.newPsw.value.trim();
    const confirmPsw = changePswForm.confirmPsw.value.trim();

    if (!currentPsw || !newPsw || !confirmPsw) {
      alert("All fields are required");
      return;
    }
    if (newPsw !== confirmPsw) {
      alert("confirmd password doesnt match");
    }
    const formData = { currentPsw, password: newPsw };
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // const psw = await response.json();
        // alert("successfully changed");
        changePswForm.reset();
        window.location.href = "/dashboard";
      } else {
        const error = await response.json();
        throw new Error(`Error ${error}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });
}

if(loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const userName = loginForm.userName.value.trim()
    const password = loginForm.password.value.trim()
    const formData = {userName, password}
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        loginForm.reset();
        window.location.href = "/dashboard";
      } else {
        const error = await response.json();
        alert(`Error ${error.message}` || 'Inalid username or password');
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  })
}
