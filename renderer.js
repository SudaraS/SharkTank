const { ipcRenderer } = require("electron");

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const alertText = document.getElementById("alert");

//const sharks = document.querySelectorAll(".icon, .icon2, .icon3, .icon4"); // Select all shark images
const soundEffect = document.getElementById("soundEffect");
const shark = document.getElementById("shark");

canvas.width = window.innerWidth;
canvas.height = 400;

let packets = [];
let ipCount = {};
const ATTACK_THRESHOLD = 15; // Define a limit for DDoS detection
let isDDoS = false;

ipcRenderer.on("packet-data", (event, data) => {
    const parts = data.split("\t");
    const [src, dst, size, tag] = parts;

    if (!src || !dst) return;

    // Store packet data
    packets.push({ src, dst, size, x: Math.random() * canvas.width, y: 0,  isDDoS: tag === "DDoS"});

    // Count packets per source IP
    ipCount[src] = (ipCount[src] || 0) + 1;

    // Check for DDoS attack
    if (ipCount[src] > ATTACK_THRESHOLD) {
        if (!isDDoS) { // Trigger alert only once
            alertText.style.display = "block"; // Show red alert
            soundEffect.play(); // Play alarm sound
            //sharks.forEach((shark) => shark.style.display = "block");
            shark.style.display = "block";
            isDDoS = true; // Set DDoS flag
        }
    }
    else if (isDDoS) { // When attack stops
        alertText.style.display = "none";
        soundEffect.pause();
        soundEffect.currentTime = 0; // Reset sound
        shark.style.display = "none"; // Hide sharks
        isDDoS = false; // Reset DDoS flag
    }
});

// Animation loop
function drawPackets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    packets.forEach((packet, index) => {
        ctx.fillStyle = packet.isDDoS ? "red" : "green";
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
