const electron = require('electron')
const fs = require('fs')

const { app, BrowserWindow, Menu, ipcMain } = electron

const saves = 'saves.json'

let mainWindow

let list = []

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  fs.readFile(saves, 'utf8', (err, data) => {
    try {
      if (err) throw err 
      list = (data) ? JSON.parse(data) : []
    } catch (error) {
      list = []
    }
    
    console.log(data)
  })

  mainWindow.on('closed', () => {
    fs.writeFile(saves, JSON.stringify(list, null, 2), (err) => {
      if(err) {
        console.log(err)
      } else {
        console.log('The file was saved')
      }       
    })
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

ipcMain.on('todo:loadList', () => {
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:markDone', (event, index) => {
  list[index].status = 'done'

  list[index].time.completed = new Date()
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:editItem', (event, data) => {
  list[data.index].name = data.value
  mainWindow.webContents.send('todo:updated', list)
})

ipcMain.on('todo:add', (event, todo) => {
  const item = newItem(todo)
  list.push(item)
  mainWindow.webContents.send('todo:updated', list)
})

const newItem = (todo) => {
  return {
    name: todo.text,
    status: 'undone',
    time: {
      started: new Date().toLocaleString(),
      goal: todo.time,
      completed: null
    }
  }
}

ipcMain.on('todo:deleteItem', (event, index) => {
  list.splice(index, 1)
  mainWindow.webContents.send('todo:updated', list)

})

ipcMain.on('listClear', () => {
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
