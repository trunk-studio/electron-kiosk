const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const exec = require('child_process').exec



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 480})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

electron.ipcMain.on('poweroff', (event, arg) => {
  exec('sudo poweroff', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});

electron.ipcMain.on('reboot', (event, arg) => {
  exec('sudo reboot', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});

electron.ipcMain.on('update-temperature', (event, arg) => {
  exec('temperature', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      event.returnValue = Math.round(Math.random() * 50);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    event.returnValue = parseInt(stdout);
  });
});

electron.ipcMain.on('exportReport', (event, arg) => {
  console.log("=== exportReport ===");

  exec('temperature', (error, stdout, stderr) => {
    var temperature = parseInt(stdout) || "23"
    var project_path = __dirname

    var exportReportCmd = 'jasperstarter pr '+project_path+'/reports/demo/trunkDemo.jrxml -P temperature=\''+temperature+'\' project_path=\''+project_path+'\' -f pdf'

    var result = exportReportCmd;


    exec(exportReportCmd, (error, stdout, stderr) => {

      if (error) {
        console.error(`exec error: ${error}`);
        result += `&& ${error}`
        event.returnValue = result;
        return;
      }

      exec('lpr '+project_path+'/reports/demo/trunkDemo.pdf', (error, stdout, stderr) => {
        console.log("=== jasperstarter lpr ===", stdout);
        if (error) {
          result += `&& ${error}`
          event.returnValue = result;
          return;
        }


        event.returnValue = result;

      });

    });
  });
});
