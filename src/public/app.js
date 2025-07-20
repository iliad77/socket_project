const activity = document.querySelector(".activity");
const msgList = document.querySelector("ul");
const form = document.querySelector("form");
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgID");
let jwtoken = localStorage.getItem("jwt");
const loginBtn = document.getElementById("loginBtn");
const loginPopup = document.getElementById("loginPopup");
const loginStatus = document.getElementById("loginStatus");
let targetuser = null;

console.log("jwtoken:", jwtoken);
console.log("loginPopup:", loginPopup);

document.getElementById("setTarget").addEventListener("click", () => {
    const input = document.getElementById("toUser").value.trim();
    if (input) {
        targetuser = input;
        document.getElementById("toUser").disabled = true;
        alert(`message will sent to ${targetuser}`);
    }
});

document.getElementById("changeTarget").addEventListener("click", () => {
    targetuser = null;
    document.getElementById("toUser").disabled = false;
});

loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) return;

    const res = await fetch("http://localhost:3000/api/v0/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
        jwtoken = data.token;
        localStorage.setItem("jwt", jwtoken);
        loginPopup.style.display = "none";
    } else {
        loginStatus.textContent = data.msg || "Login failed";
    }

    const socket = io("http://localhost:3000", {
        extraHeaders: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = msgInput.value.trim();
        if (!targetuser) {
            alert("Please set the user you want to message.");
            return;
        }
        if (msgInput.value && targetuser) {
            socket.emit("message", { to: targetuser, message: msgInput.value });
            msgInput.value = "";
        }
    });
    socket.on("message", (msg) => {
        const item = document.createElement("li");
        item.textContent = msg;
        messages.appendChild(item);
    });
});
