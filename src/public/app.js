const socket = io("http://localhost:3000");

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("input");
    if (input.value) {
        socket.emit("message", input.value);
        input.value = "";
    }
    input.focus();
});

socket.on("message", (data) => {
    const li = document.createElement("li");
    li.textContent = data;
    document.querySelector("ul").appendChild(li);
});
