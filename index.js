const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  mainWindow.on('closed', () => app.quit())

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

const list = []
ipcMain.on('todo:add', (event, todo) => {
  list.push(todo)
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:deleteItem', (event, index) => {
  list.splice(index, 1)
  mainWindow.webContents.send('todo:updated', list)

})

ipcMain.on('listClear', (event) => {
  while(list.length > 0) {
    list.pop()
  }
})

const menuTemplate = [
  {
    label: 'file',
    submenu: [
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
  menuTemplate.unshift({label: ''})
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}
