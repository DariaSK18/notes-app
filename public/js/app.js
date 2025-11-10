const registerform = document.getElementById("registerForm");
const noteForm = document.getElementById("noteForm");
const logoutBtn = document.getElementById("logout");
const deleteBtn = document.getElementById("delete");
const changePswForm = document.getElementById("changePswForm");
const loginForm = document.getElementById("loginForm");

const notesList = document.querySelector(".notes-list");

if (registerform) {
  registerform.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log(registerform);

    const userName = registerform.userName.value.trim();
    const password = registerform.password.value.trim();
    const confirmation = registerform.confirmation.value.trim();
    console.log(userName, password, confirmation);

    if (!userName || !password || !confirmation) {
      // alert("All fields are required");
      showMessage("All fields are required", "error");
      return;
    }
    if (password !== confirmation) {
      // alert("Password doesn't match your confirmation");
      showMessage("Password doesn't match your confirmation", "error");
      return;
    }
    if (password.length < 8) {
      // alert("Password doesn't match your confirmation");
      showMessage("Password must be at least 8 characters", "error");
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
        showMessage("Registration successful!", "success");
        // console.log(response.ok);
        const user = await response.json();
        // console.log(user);
        registerform.reset();
        setTimeout(() => {
          window.location.href = "/login";
        }, 300);
      } else {
        const error = await response.json();
        showMessage("Registration failed. Try again.", "error");
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
        // showMessage("Loged out!", "success");
        // setTimeout(() => {
        window.location.href = "/login";
        // },2000)
      }
    } catch (err) {
      console.log(err);
    }
  });
}

if (noteForm) {
  const noteId = noteForm.dataset.id;
  if (noteId) {
    (async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "GET",
          credentials: "same-origin",
        });
        if (response.ok) {
          // showMessage("Note saved successfully!", "success");
          const note = await response.json();
          noteForm.title.value = note.title;
          noteForm.description.value = note.description;
        } else {
          showMessage("Failed to get note!", "error");
          console.log("Error to get note");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }
  noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = noteForm.title.value.trim();
    const description = noteForm.description.value.trim();

    if (!title || !description) {
      // alert("all fields are required");
      showMessage("All fields are required!", "error");
      return;
    }
    const formData = { title, description };
    try {
      const url = noteId ? `/api/notes/${noteId}` : "/api/notes";
      const method = noteId ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "same-origin",
      });
      if (response.ok) {
        // const note = await response.json();
        showMessage("Note saved successfully!", "success");
        noteForm.reset();
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 300);
      } else {
        const error = await response.json();
        showMessage("Failed to save note!", "error");
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
      if (response.ok) {
        showMessage("Profile deleted successfully!", "success");
        setTimeout(() => {
          window.location.href = "/register";
        }, 300);
      } else showMessage("Failed to delete profile!", "error");
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
      // alert("All fields are required");
      showMessage("All fields are required!", "error");
      return;
    }
    if (newPsw !== confirmPsw) {
      // alert("confirmd password doesnt match");
      showMessage("Passwords don't match!", "error");
      return;
    }
    const formData = { currentPsw, password: newPsw };
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        showMessage("Password changed successfully!", "success");
        // const psw = await response.json();
        // alert("successfully changed");
        changePswForm.reset();
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 300);
      } else {
        const error = await response.json();
        showMessage("Failed to change password!", "error");
        throw new Error(`Error ${error}`);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = loginForm.userName.value.trim();
    const password = loginForm.password.value.trim();
    const formData = { userName, password };
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        loginForm.reset();
        showMessage("Loged in successfully!", "success");
        // setTimeout(() => {
        window.location.href = "/dashboard";
        // }, 500)
      } else {
        const error = await response.json();
        showMessage("Invalid username or password!", "error");
        // alert(`Error ${error.message}` || "Inalid username or password");
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  });
}

if (notesList) {
  notesList.addEventListener("click", async (e) => {
    console.log(e.target);
    const clicked = e.target;
    if (clicked.classList.contains("deleteNote")) {
      const li = clicked.closest("li");
      const id = li.getAttribute("id");
      // console.log(id);
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
        if (response.ok) {
          showMessage("Note deleted successfully!", "success");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 300);
        } else showMessage("Failed to delete note!", "error");
      } catch (error) {
        console.log(error);
      }
    }
    if (clicked.classList.contains("editNote")) {
      const li = clicked.closest("li");
      const id = li.getAttribute("id");
      console.log(li);
      // try {
      //   const response = await fetch(`/api/notes/${id}`, {
      //     method: 'GET',
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(formData),
      //     credentials: 'same-origin'
      // })
      window.location.href = `/create-note/${id}`;
      //  if (response.ok) {
      //   const note = await response.json()
      //   console.log(note);
      //   noteForm.title = note.title,
      //   noteForm.description = note.description
      //  }
      // } catch (error) {
      //   console.log(error);
      // }
    }
  });
}

function showMessage(text, type, duration = 3000) {
  const message = document.getElementById("message");
  if (!message) return;
  message.innerText = text;
  message.className = `message show ${type}`;
  message.classList.remove("hidden");

  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => {
      message.classList.add("hidden");
    }, 300);
  }, duration);
}
