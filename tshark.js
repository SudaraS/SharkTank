const { spawn } = require("child_process");
const { ipcMain } = require("electron");
const os = require("os");


function startPacketCapture(mainWindow) {
    //const tshark = spawn("tshark", ["-i", "Wi-Fi", "-T", "fields", "-e", "ip.src", "-e", "ip.dst", "-e", "frame.len"]);
    let command = '"C:\\Program Files\\Wireshark\\tshark.exe" -i 5';
    //let args = ["-i", "Wi-Fi", "-w", "capture.pcap"];

    const tshark = spawn(command, {shell:true});

    tshark.stdout.on("data", (data) => {
        const packetInfo = data.toString().trim();
        if (packetInfo) {
            mainWindow.webContents.send("packet-data", packetInfo); // Send data to UI
        }
    });

    tshark.on("error", (err) => {
        console.error("Failed to start process:", err);
    });

    tshark.stderr.on("data", (data) => {
        console.error(`Error from tshark: ${data.toString()}`);
    });

    tshark.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    tshark.on("close", (code) => {
        console.log(`TShark exited with code ${code}`);
    });
}

module.exports = { startPacketCapture };
