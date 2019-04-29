const electron = require('electron')
const fs = require('fs')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow

let list = []

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  fs.readFile('/tmp/todoSaves', 'utf8', (err, data) => {
    // if (err) throw err 
      console.log(data)    
      if(JSON.parse(data)) {list = JSON.parse(data)}   
    })
    mainWindow.on('closed', () => {
      fs.writeFile('/tmp/todoSaves', JSON.stringify(list), function(err) {
        // if(err) throw err       
      })
      console.log('The file was saved')
      app.quit()
    })

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:markDone', (event, index) => {
  list[index].status = 'done'
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:editItem', (event, data) => {
  list[data.index].name = data.value
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:add', (event, todo) => {
  const item = {
    name: todo,
    status: 'undone'
  }
  list.push(item)
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
