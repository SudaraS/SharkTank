const { ipcRenderer } = require("electron");

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const alertText = document.getElementById("alert");

canvas.width = window.innerWidth;
canvas.height = 400;

let packets = [];
let ipCount = {};
const ATTACK_THRESHOLD = 5; // Define a limit for DDoS detection

ipcRenderer.on("packet-data", (event, data) => {
    console.log("Packet data received:", data);
    const [src, dst, size] = data.split("\t");
    if (!src || !dst) return;

    // Store packet data
    packets.push({ src, dst, size, x: Math.random() * canvas.width, y: 0 });

    // Count packets per source IP
    ipCount[src] = (ipCount[src] || 0) + 1;

    // Check for DDoS attack
    if (ipCount[src] > ATTACK_THRESHOLD) {
        alertText.style.display = "block"; // Show red alert
    }
});

// Animation loop
function drawPackets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    packets.forEach((packet, index) => {
        ctx.fillStyle = packet.size > 1000 ? "red" : "Maroon"; // Large packets in red
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 5, 0, Math.PI * 2);
        ctx.fill();

        packet.y += 2; // Move packets downward

        // Remove packets when they leave the screen
        if (packet.y > canvas.height) packets.splice(index, 1);
    });

    requestAnimationFrame(drawPackets);
}

drawPackets();
