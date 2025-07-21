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

const setButton = document.getElementById("setTarget");
document.getElementById("setTarget").addEventListener("click", async () => {
    const input = document.getElementById("toUser").value.trim();
    if (input) {
        targetuser = input;
        document.getElementById("toUser").disabled = true;
        activity.classList.add("hidden");
        setButton.classList.add("hidden");
        alert(`message will sent to ${targetuser}`);
        const user = await fetch(
            `http://localhost:3000/api/v0/users/${targetuser}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            }
        );
        const userdata = await user.json();
        console.log("userdata==", userdata);
        console.log("user==", user);
        if (!userdata.id || !user.ok) {
            alert("target user not found!");
            return;
        }
        const sender = localStorage.getItem("id");
        const history = await fetch(
            `http://localhost:3000/api/v0/messages/${sender}/${userdata.id}`,
            {
                headers: {
                    Authorization: `Bearer ${jwtoken}`,
                },
            }
        );
        const res = await history.json();

        messages.innerHTML = "";
        res.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = `${msg.sender.username} : ${msg.content}`;
            messages.appendChild(li);
        });
    }
});

document.getElementById("changeTarget").addEventListener("click", () => {
    targetuser = null;
    document.getElementById("toUser").disabled = false;
    activity.classList.remove("hidden");
    setButton.classList.remove("hidden");
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
        localStorage.setItem("id", data.user);
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
