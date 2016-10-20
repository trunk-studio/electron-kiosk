// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipcRenderer = require('electron').ipcRenderer;

$('#btnShutdown').click(function() {
  ($('#dlgShutdown').data('dialog')).open();
});

$('#btnPoweroff').click(function() {
  ipcRenderer.send('poweroff');
});

$('#btnReboot').click(function() {
  ipcRenderer.send('reboot');
});

$("#btnExportReport").on("click", function(){
  ipcRenderer.send('exportReport');
})

function updateTemperature() {
  $('#txtTemperature').text(ipcRenderer.sendSync('update-temperature'));
  setTimeout(updateTemperature, 3000);
}

updateTemperature();
