const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
const mihome = require("node-mihome");
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
    icon: __dirname + "/assets/icons/win/icon.ico",
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("getDevices", async (e, item) => {
  try {
    if (mihome.miCloudProtocol.isLoggedIn) {
      await mihome.miCloudProtocol.logout();
    }
    await mihome.miCloudProtocol.login(item.login, item.password);
    const regions = ["ru", "us", "tw", "sg", "cn", "de"];
    const allDevices = [];
    for (let index = 0; index < regions.length; index++) {
      const country = regions[index];
      const options = { country };
      const devices = await mihome.miCloudProtocol.getDevices(null, options);
      const devicesWithRegion = [];
      for (let j = 0; j < devices.length; j++) {
        const device = devices[j];
        device["region"] = country;
        devicesWithRegion.push(device);
      }
      allDevices.push(...devicesWithRegion);
    }

    mainWindow.webContents.send("devices", allDevices);
  } catch (error) {
    mainWindow.webContents.send("devices", error);
  }
});
