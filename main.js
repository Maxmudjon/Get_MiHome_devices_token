const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
const mihome = require("node-mihome");
const miio = require("miio");
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
    const allDevices = [];
    const country = regions[item.server];
    const options = { country };
    const devices = await mihome.miCloudProtocol.getDevices(null, options);
    const devicesWithRegion = [];

    for (let j = 0; j < devices.length; j++) {
      const device = devices[j];
      device["region"] = country;
      device.deviceImage = deviceImagesAndModelsMap.get(device.model)?.img || "";
      devicesWithRegion.push(device);
    }

    allDevices.push(...devicesWithRegion);

    mainWindow.webContents.send("devices", allDevices);
  } catch (error) {
    mainWindow.webContents.send("devices", error);
  }
});

ipcMain.on("setVacuumVoicePack", async (e, item) => {
  const voices = [
    {
      sa_id: 5021,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Винни Пух",
      keyName: "озвучка Винни Пух",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "V0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Vinni_Puh/ru.tar.gz",
            },
            {
              piid: 5,
              value: "9037b58b9f401a9f57285d0299865393",
            },
            {
              piid: 6,
              value: 1536064,
            },
          ],
        },
      },
    },
    {
      sa_id: 5022,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Домовенок Кузя + Алиса",
      keyName: "озвучка Домовенок Кузя + Алиса",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "D0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/domovenok/ru.tar.gz",
            },
            {
              piid: 5,
              value: "9756cc5723491e64535f7ce3a9207043",
            },
            {
              piid: 6,
              value: 1415074,
            },
          ],
        },
      },
    },
    {
      sa_id: 5023,
      model: "dreame.vacuum.mc1808",
      name: "озвучка ельцин",
      keyName: "озвучка ельцин",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "E0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/eltsin/ru.tar.gz",
            },
            {
              piid: 5,
              value: "59d4f49a466a060f94764a3654a675f2",
            },
            {
              piid: 6,
              value: 6365813,
            },
          ],
        },
      },
    },
    {
      sa_id: 5024,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Алиса",
      keyName: "озвучка Алиса",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "A0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Alice/ru.tar.gz",
            },
            {
              piid: 5,
              value: "409cd8721ad5b8659872167044ee3298",
            },
            {
              piid: 6,
              value: 5108752,
            },
          ],
        },
      },
    },
    {
      sa_id: 5025,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Робот Бендер + Алиса",
      keyName: "озвучка Робот Бендер + Алиса",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "R0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Robot_Bender/ru.tar.gz",
            },
            {
              piid: 5,
              value: "216645a3357bcf14e67235046f8eca82",
            },
            {
              piid: 6,
              value: 1200728,
            },
          ],
        },
      },
    },
    {
      sa_id: 5026,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Starcraft_2",
      keyName: "озвучка Starcraft_2",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "S0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Starcraft_2/ru.tar.gz",
            },
            {
              piid: 5,
              value: "26b360e737295e3eaa09c764c0ed5c91",
            },
            {
              piid: 6,
              value: 1894466,
            },
          ],
        },
      },
    },
    {
      sa_id: 5027,
      model: "dreame.vacuum.mc1808",
      name: "озвучка WarCraft_II",
      keyName: "озвучка WarCraft_II",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "W0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/WarCraft_II/ru.tar.gz",
            },
            {
              piid: 5,
              value: "9f30a9a9d06d86a9cc2c047875b579df",
            },
            {
              piid: 6,
              value: 2105579,
            },
          ],
        },
      },
    },
    {
      sa_id: 5028,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим",
      keyName: "озвучка Максим",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "M3",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Maksim_3/ru.tar.gz",
            },
            {
              piid: 5,
              value: "06d8234f57f6f162aadaa966d19c1ecc",
            },
            {
              piid: 6,
              value: 4929222,
            },
          ],
        },
      },
    },
    {
      sa_id: 5029,
      model: "dreame.vacuum.mc1808",
      name: "озвучка женский голос",
      keyName: "озвучка женский голос",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "G0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Ghenckij/ru.tar.gz",
            },
            {
              piid: 5,
              value: "e353250025f6e76bedd400ba5a0bbac7",
            },
            {
              piid: 6,
              value: 2524065,
            },
          ],
        },
      },
    },
    {
      sa_id: 5030,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Татьяна",
      keyName: "озвучка Татьяна",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "T0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Tatyana/ru.tar.gz",
            },
            {
              piid: 5,
              value: "e25632b784e7f40abcf249518ef9572f",
            },
            {
              piid: 6,
              value: 2409232,
            },
          ],
        },
      },
    },
    {
      sa_id: 5031,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим 1",
      keyName: "озвучка Максим 1",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "M1" },
            { piid: 4, value: "https://vacuum.ucoz.net/Maksim_1/ru.tar.gz" },
            { piid: 5, value: "cfae30a43c1455a45980aa9f62602420" },
            { piid: 6, value: 4017768 },
          ],
        },
      },
    },
    {
      sa_id: 5032,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим 2",
      keyName: "озвучка Максим 2",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "M2" },
            { piid: 4, value: "https://vacuum.ucoz.net/Maksim_2/ru.tar.gz" },
            { piid: 5, value: "9f4244023f1b6caafc1a08b0d5650acb" },
            { piid: 6, value: 4849194 },
          ],
        },
      },
    },
    {
      sa_id: 5033,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим 3",
      keyName: "озвучка Максим 3",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "M3" },
            { piid: 4, value: "https://vacuum.ucoz.net/Maksim_3/ru.tar.gz" },
            { piid: 5, value: "06d8234f57f6f162aadaa966d19c1ecc" },
            { piid: 6, value: 4929222 },
          ],
        },
      },
    },
    {
      sa_id: 5034,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим мат 1",
      keyName: "озвучка Максим мат 1",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "M5" },
            { piid: 4, value: "https://vacuum.ucoz.net/Maksim_Mat/ru.tar.gz" },
            { piid: 5, value: "be8de36f82ac19ed00583a2680d6ca06" },
            { piid: 6, value: 1338689 },
          ],
        },
      },
    },
    {
      sa_id: 5035,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим мат 2",
      keyName: "озвучка Максим мат 2",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "M6" },
            { piid: 4, value: "https://vacuum.ucoz.net/Maksim_Mat_2/ru.tar.gz" },
            { piid: 5, value: "e883f332491a7e02d270cdce0ebdb19a" },
            { piid: 6, value: 1809402 },
          ],
        },
      },
    },
    {
      sa_id: 5036,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим мат 3",
      keyName: "озвучка Максим мат 3",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "M7" },
            { piid: 4, value: "https://vacuum.ucoz.net/Maksim_Mat_3/ru.tar.gz" },
            { piid: 5, value: "48fbd1a6ff1c033d2139cb92ee6982bc" },
            { piid: 6, value: 4836238 },
          ],
        },
      },
    },
    {
      sa_id: 5037,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Советские фильмы",
      keyName: "озвучка Советские фильмы",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "NL" },
            { piid: 4, value: "https://zhelnin.gear.host/soviet_movies.tar.gz" },
            { piid: 5, value: "6e39b171679bb77c22a32cc77204e5eb" },
            { piid: 6, value: 2047368 },
          ],
        },
      },
    },
    {
      sa_id: 5038,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Советские фильмы 2",
      keyName: "озвучка Советские фильмы 2",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "HU" },
            { piid: 4, value: "https://zhelnin.gear.host/soviet_movies2.tar.gz" },
            { piid: 5, value: "a9c75a5191dba286d835c31459573213" },
            { piid: 6, value: 5788483 },
          ],
        },
      },
    },
    {
      sa_id: 5039,
      model: "dreame.vacuum.mc1808",
      name: "озвучка google_voice",
      keyName: "озвучка google_voice",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "IN" },
            { piid: 4, value: "https://zhelnin.gear.host/google_voice.tar.gz" },
            { piid: 5, value: "4ca5de2000adf179d417fd400e396016" },
            { piid: 6, value: 752591 },
          ],
        },
      },
    },
    {
      sa_id: 5040,
      model: "dreame.vacuum.mc1808",
      name: "озвучка кожанные ублюдки 2",
      keyName: "озвучка кожанные ублюдки 2",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "FR" },
            { piid: 4, value: "https://zhelnin.gear.host/fun_leather_bastards.tar.gz" },
            { piid: 5, value: "9450d9cbb3d0083702084bcb82f41239" },
            { piid: 6, value: 2868229 },
          ],
        },
      },
    },

    {
      sa_id: 5041,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Максим мат_3",
      keyName: "озвучка Максим мат_3",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "M7",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Maksim_Mat_3/ru.tar.gz",
            },
            {
              piid: 5,
              value: "48fbd1a6ff1c033d2139cb92ee6982bc",
            },
            {
              piid: 6,
              value: 4836238,
            },
          ],
        },
      },
    },
    {
      sa_id: 5042,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Филипп",
      keyName: "озвучка Филипп",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "F0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/filip/ru.tar.gz",
            },
            {
              piid: 5,
              value: "8cdca3d7ac656b2cba2b4f50197b2505",
            },
            {
              piid: 6,
              value: 2318266,
            },
          ],
        },
      },
    },
    {
      sa_id: 5043,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Кожаные ублюдки",
      keyName: "озвучка Кожаные ублюдки",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "M0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/ubludki/ru.tar.gz",
            },
            {
              piid: 5,
              value: "6602a37381709e7ff24898295ec7ebe1",
            },
            {
              piid: 6,
              value: 2019199,
            },
          ],
        },
      },
    },
    {
      sa_id: 5044,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Кузя+Захар",
      keyName: "озвучка Кузя+Захар",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "K1",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/kuzyaz/ku1.tar.gz",
            },
            {
              piid: 5,
              value: "2a3b917c188819abd3ccf3fca051cbf5",
            },
            {
              piid: 6,
              value: 1703155,
            },
          ],
        },
      },
    },
    {
      sa_id: 5045,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Вини пух 2",
      keyName: "озвучка Вини пух 2",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "PT" },
            { piid: 4, value: "https://zhelnin.gear.host/vinni.tar.gz" },
            { piid: 5, value: "f51f2b1d67a54675eae8a72d1d166ca3" },
            { piid: 6, value: 1534827 },
          ],
        },
      },
    },
    {
      sa_id: 5046,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Вини пух 3",
      keyName: "озвучка Вини пух 3",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            { piid: 3, value: "KO" },
            { piid: 4, value: "https://zhelnin.gear.host/kuzya.tar.gz" },
            { piid: 5, value: "9756cc5723491e64535f7ce3a9207043" },
            { piid: 6, value: 1415074 },
          ],
        },
      },
    },
    {
      sa_id: 5047,
      model: "dreame.vacuum.mc1808",
      name: "озвучка Захар",
      keyName: "озвучка Захар",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "Z0",
            },
            {
              piid: 4,
              value: "https://dreamef9.my1.ru/Zahar/ru.tar.gz",
            },
            {
              piid: 5,
              value: "b9bca4cd385234c11d9c4a37cf3b7918",
            },
            {
              piid: 6,
              value: 1364610,
            },
          ],
        },
      },
    },
    {
      sa_id: 5048,
      model: "dreame.vacuum.mc1808",
      name: "озвучка R2D2_RU",
      keyName: "озвучка R2D2_RU",
      type: 0,
      groupInfo: [],
      tr_id: 201,
      payload: {
        value: {
          siid: 24,
          aiid: 2,
          in: [
            {
              piid: 3,
              value: "D0",
            },
            {
              piid: 4,
              value: "https://robot1c.do.am/Domovenok_Kuzya/r2d2ru.tar.gz",
            },
            {
              piid: 5,
              value: "a3b38d6fabc6681b3658f60667e0d3c6",
            },
            {
              piid: 6,
              value: 1418466,
            },
          ],
        },
      },
    },
  ];
  try {
    const device = await miio.device({ address: item.ip, token: item.token });
    await new Promise((resolve) => setTimeout(resolve(), 1000));
    const result = await device.call("action", voices.filter((v) => v.sa_id == item.packID)[0].payload.value, { retries: 1 });

    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", result);
  } catch (error) {
    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", error);
  }
});

ipcMain.on("playVoice", async (e, item) => {
  try {
    const device = await miio.device({ address: item.ip, token: item.token });
    await new Promise((resolve) => setTimeout(resolve(), 1000));
    const result = await device.call("action", { siid: 24, aiid: 3, did: "call-24-3", in: [] }, { retries: 1 });

    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", result);
  } catch (error) {
    mainWindow.webContents.send("vacuumVoicePackSuccessfullyInstalled", error);
  }
});
