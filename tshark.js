const { spawn } = require("child_process");
const { ipcMain } = require("electron");

function startPacketCapture(mainWindow) {
    const tshark = spawn("tshark", ["-i", "en0", "-T", "fields", "-e", "ip.src", "-e", "ip.dst", "-e", "frame.len", "-l"]);
    
    tshark.on("error", (err) => {
        console.error("Failed to start TShark:", err);
    });

    tshark.stdout.on("data", (data) => {
        const packetInfo = data.toString().trim();
        if (packetInfo) {
            mainWindow.webContents.send("packet-data", packetInfo); // Send data to UI
        }
    });

    tshark.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    tshark.stderr.on("data", (data) => {
        console.error(`TShark Error: ${data.toString()}`);
    });

    tshark.on("close", (code) => {
        console.log(`TShark exited with code ${code}`);
    });;

    tshark.stderr.on("data", (data) => {
        console.error(`TShark Error: ${data.toString()}`);
    });

    tshark.on("close", (code) => {
        console.log(`TShark exited with code ${code}`);
    });
}

module.exports = { startPacketCapture };
