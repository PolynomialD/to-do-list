const electron = require('electron')

const { app, BrowserWindow, Menu } = electron

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

const menuTemplate = [
  {
    label: 'file',
    submenu: [
      { label: 'New Todo'},
      {
        label:'quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }
    ]
  }
]
  // Mac check
if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}