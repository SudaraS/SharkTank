const { app, BrowserWindow } = require("electron");
const {spawn} = require("child_process");
const path = require("path");
const { startPacketCapture } = require("./tshark");
const os = require("os");
const { start } = require("repl");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
        transparent: true
    });

    mainWindow.loadFile("index.html");

    startPacketCapture(mainWindow); 

   // startPacketCapture(mainWindow); // Start capturing packets when app opens
    const pythonProcess = spawn("python", [path.join(__dirname, "ddos.attack.py")]);

    pythonProcess.stdout.on("data", (data) => {
        const packetInfo = data.toString().trim();
        if(packetInfo){
            mainWindow.webContents.send("packet-data", packetInfo);
        }
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    })

    pythonProcess.on("close", (code) => {
        console.log(`Python script exited with code ${code}`);
    });

});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});


