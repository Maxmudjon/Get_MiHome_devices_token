const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
const mihome = require("node-mihome");
const __miio = require("miio");
const deviceImagesAndModelsArr = require("./only_images_and_models.json");
const deviceImagesAndModelsMap = new Map(deviceImagesAndModelsArr.map((item) => [item.model, item]));
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    icon: __dirname + "/assets/icons/win/icon.ico",
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("index.html");
}

const tokenToMiioDeviceMap = new Map();
async function connectToDevice(options) {
  if(tokenToMiioDeviceMap.has(options.token)) return tokenToMiioDeviceMap.get(options.token)
  const device = await __miio.device(options)
  tokenToMiioDeviceMap.set(device.token, device)
  return device
}

let allDevices = []
let tokenToDeviceDataMap = new Map()

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
    const regions = { Russia: "ru", USA: "us", Taiwan: "tw", Singapore: "sg", China: "cn", Germany: "de" };
    allDevices = [];
    tokenToDeviceDataMap = new Map();
    const country = regions[item.server];
    const options = { country };
    const devices = await mihome.miCloudProtocol.getDevices(null, options);
    const devicesWithAdditionalData = [];

    const lanIndicators = item.lanMode 
      ? await Promise.allSettled(
          devices.map(
            (device) => 
              !device.localip ? undefined : connectToDevice({ address: device.localip, token: device.token })
                .then((device)=>device.call('get_prop', ['lan_ctrl'])) // undefined | ['1'] | ['0']
                .then((result) => result?.[0] === '1' ? true : result?.[0] === '0' ? false : null)
          )
        ).then((results) => results.map((result) => result.value))
      : [];

    for (let j = 0; j < devices.length; j++) {
      const device = devices[j];
      device["region"] = country;
      device["lanMode"] = lanIndicators[j];
      device["lanModeSupported"] = device.model.startsWith('yeelink.light');
      device.deviceImage = deviceImagesAndModelsMap.get(device.model)?.img || "";
      devicesWithAdditionalData.push(device);
      tokenToDeviceDataMap.set(device.token, device);
    }

    allDevices.push(...devicesWithAdditionalData);

    mainWindow.webContents.send("devices", allDevices);
  } catch (error) {
    mainWindow.webContents.send("devices", error);
  }
});

ipcMain.on("toggleLanMode", async (e, item) => {
  const deviceData = tokenToDeviceDataMap.get(item.token)
  try {
    const newMode = deviceData.lanMode ? '0' : '1'
    const device = await connectToDevice({ address: item.ip, token: item.token });
    const result = await device.call('set_ps', ['cfg_lan_ctrl', newMode], { retries: 1 })
    if (result[0] === 'ok') {
      allDevices = allDevices.map((d) => d.token === item.token ? {...d, lanMode: !d.lanMode} : d)
    }
  } finally {
    mainWindow.webContents.send("devices", allDevices);
  }
})

ipcMain.on("setVacuumVoicePack", async (e, item) => {
  const voices = require("./vacuum_voices.json");
  try {
    const device = await connectToDevice({ address: item.ip, token: item.token });
    await new Promise((resolve) => setTimeout(resolve(), 1000));
    const result = await device.call("action", voices.filter((v) => v.sa_id == item.packID)[0].payload.value, { retries: 1 });

    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", result);
  } catch (error) {
    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", error);
  }
});

ipcMain.on("playVoice", async (e, item) => {
  try {
    const device = await connectToDevice({ address: item.ip, token: item.token });
    await new Promise((resolve) => setTimeout(resolve(), 1000));
    const result = await device.call("action", { siid: 24, aiid: 3, did: "call-24-3", in: [] }, { retries: 1 });

    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", result);
  } catch (error) {
    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", error);
  }
});
