const electron = require('electron')

const { app, BrowserWindow, Menu } = electron

let mainWindow, addWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  })
  addWindow.loadURL(`file://${__dirname}/add.html`)
}

const menuTemplate = [
  {
    label: 'file',
    submenu: [
      { label: 'New Todo',
        click() { createAddWindow() }
      },
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