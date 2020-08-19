const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: { nodeIntegration: true },
    });
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.on("close", cleanUpSerial);
    mainWindow.onbeforeunload = function (e) {
        cleanUpSerial();
    };
    console.log(console.log("WIN", mainWindow));
}

function cleanUpSerial() {
    if (mainWindow && mainWindow.pport) {
        if (mainWindow.pport.isOpen) {
            mainWindow.pport.close();
        }
        if (!mainWindow.pport.destroyed) {
            mainWindow.pport.destroy();
        }
    }
}

app.allowRendererProcessReuse = false;
app.on("ready", createWindow);
app.on("before-quit", cleanUpSerial);
app.on("quit", cleanUpSerial);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
