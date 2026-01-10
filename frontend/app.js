

// ================= CONFIG =================
const API_URL = "http://localhost:5000"
const NOTES_API = "http://localhost:5000/notes"

// ================= ELEMENTS =================
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const authSection = document.getElementById("auth-section")
const dashboardSection = document.getElementById("dashboard-section")
const authMessage = document.getElementById("auth-message")
const usernameDisplay = document.getElementById("username-display")
const logoutBtn = document.getElementById("logout-btn")

// ================= DASHBOARD =================
function showDashboard(name) {
  authSection.style.display = "none"
  dashboardSection.style.display = "block"
  usernameDisplay.textContent = `Welcome, ${name}!`
  const token = localStorage.getItem("token")
  if (!token) {
    showToast("Login required", "error")
    authSection.style.display = "block"
    dashboardSection.style.display = "none"
    return
  }
   fetchNotes()
}

// ================= TOAST =================
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container")
  if (!container) return

  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = `
    <span class="icon">${type === "success" ? "✔" : "✖"}</span>
    <span>${message}</span>
  `

  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}



// ================= FORM SWITCH =================
document.getElementById("show-signup-btn")?.addEventListener("click", () => {
  loginForm.classList.remove("active")
  signupForm.classList.add("active")
})

document.getElementById("show-login-btn")?.addEventListener("click", () => {
  signupForm.classList.remove("active")
  loginForm.classList.add("active")
})

// ================= SIGNUP =================
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("signup-username").value
  const email = document.getElementById("signup-email").value
  const password = document.getElementById("signup-password").value

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!data.success) {
      showToast(data.message, "error")
      return
    }

    localStorage.setItem("token", data.data.token)
    localStorage.setItem("user", JSON.stringify(data.data.user))

    showToast("Account created successfully", "success")
    showDashboard(data.data.user.name)

  } catch {
    showToast("Server error", "error")
  }
})

// ================= LOGIN =================
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!data.success) {
      showToast(data.message, "error")
      return
    }

    localStorage.setItem("token", data.data.token)
    localStorage.setItem("user", JSON.stringify(data.data.user))

    showToast("Logged in successfully", "success")
    loginForm.reset()

    setTimeout(() => {
      showDashboard(data.data.user.name)
    }, 800)

  } catch {
    showToast("Server error", "error")
  }
})

// ================= AUTO LOGIN =================
function autoLogin() {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")

  if (token && user) {
    showDashboard(JSON.parse(user).name)
  }
}

autoLogin()

// ================= LOGOUT =================
logoutBtn?.addEventListener("click", () => {
  localStorage.clear()
  dashboardSection.style.display = "none"
  authSection.style.display = "block"
  showToast("Logged out successfully", "success")
})




// ================= NOTES CONFIG =================

// const NOTES_API_CREATE = "http://localhost:5000/notes/createNotes"

const notesList = document.getElementById("notes-list")
const noteFormContainer = document.getElementById("note-form-container")
const noteForm = document.getElementById("note-form")
const noteTitle = document.getElementById("note-title")
const noteDescription = document.getElementById("note-description")
const createNoteBtn = document.getElementById("create-note-btn")
const cancelNoteBtn = document.getElementById("cancel-note-btn")
const formTitle = document.getElementById("form-title")

let editNoteId = null

// ================= AUTH HEADER =================
function authHeader() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// ================= FETCH ALL NOTES =================
// async function fetchNotes() {
//   try {
//     const res = await fetch(NOTES_API, {
//       headers: authHeader(),
//     })

//     const data = await res.json()
//     if (!data.success) return

//     renderNotes(data.notes)
//   } catch {
//     showToast("Failed to load notes", "error")
//   }
// }

async function fetchNotes() {
  try {
    const res = await fetch(NOTES_API, { headers: authHeader() })
    
    if (res.status === 401) {
      // Token invalid / expired → logout user
      localStorage.clear()
      dashboardSection.style.display = "none"
      authSection.style.display = "block"
      showToast("Session expired. Please login again.", "error")
      return
    }

    const data = await res.json()
    if (!data.success) {
      showToast(data.message || "Failed to load notes", "error")
      return
    }

    renderNotes(data.notes)

  } catch (err) {
    console.error(err)
    showToast("Failed to load notes: " + err.message, "error")
  }
}


// ================= RENDER NOTES =================
function renderNotes(notes) {
  notesList.innerHTML = ""

  if (!notes.length) {
    notesList.innerHTML = `<p class="empty-state">No notes yet. Create one to get started!</p>`
    return
  }

  notes.forEach((note) => {
    const div = document.createElement("div")
    div.className = "note-card"

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <div class="note-actions">
        <button class="btn btn-secondary" onclick="editNote('${note._id}', '${note.title}', '${note.description}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteNote('${note._id}')">Delete</button>
      </div>
    `
    notesList.appendChild(div)
  })
}

// ================= SHOW CREATE FORM =================
createNoteBtn.addEventListener("click", () => {
  editNoteId = null
  formTitle.textContent = "Create New Note"
  noteForm.reset()
  noteFormContainer.style.display = "block"
})

// ================= CANCEL FORM =================
cancelNoteBtn.addEventListener("click", () => {
  noteFormContainer.style.display = "none"
  noteForm.reset()
})

// ================= CREATE / UPDATE NOTE =================

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: noteTitle.value,
    description: noteDescription.value,
  };

  try {
   
    const res = await fetch(
    editNoteId ? `${NOTES_API}/${editNoteId}` : `${NOTES_API}/createNotes`,
  {
    method: editNoteId ? "PUT" : "POST",
    headers: authHeader(),
    body: JSON.stringify(payload),
  }
);

    // safer parsing
    const text = await res.text(); // get raw response
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Failed to parse JSON, got HTML:", text);
      showToast("Server error: Invalid response", "error");
      return;
    }

    if (!data.success) {
      showToast(data.message || "Action failed", "error");
      return;
    }

    showToast(editNoteId ? "Note updated" : "Note created", "success");
    noteFormContainer.style.display = "none";
    noteForm.reset();
    fetchNotes();

  } catch (err) {
    console.error("Fetch error:", err);
    showToast("Server error: " + err.message, "error");
  }
});


// ================= EDIT NOTE =================
window.editNote = (id, title, description) => {
  editNoteId = id
  formTitle.textContent = "Edit Note"
  noteTitle.value = title
  noteDescription.value = description
  noteFormContainer.style.display = "block"
}

// ================= DELETE NOTE =================
window.deleteNote = async (id) => {
  if (!confirm("Delete this note?")) return

  try {
    const res = await fetch(`${NOTES_API}/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    })

    const data = await res.json()
    if (data.success) {
      showToast("Note deleted")
      fetchNotes()
    }
  } catch {
    showToast("Delete failed", "error")
  }
}

