const { app, BrowserWindow } = require("electron");
const path = require("path");
const { startPacketCapture } = require("./tshark");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("index.html");

    startPacketCapture(mainWindow); // Start capturing packets when app opens
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
