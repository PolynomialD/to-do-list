const electron = require('electron')
const { ipcRenderer } = electron

document.getElementById('addForm').addEventListener('submit', (event) => {
  event.preventDefault()

  const addInput = document.getElementById('addInput')
  const value = addInput.value
  if(value !== '') {
    ipcRenderer.send('todo:add', value)
    addInput.value = ""
  }
})

ipcRenderer.on('todo:add', (event, list) => {
  document.getElementById('list').innerHTML = ''
  list.forEach((todo) => {
    const li = document.createElement('li')
    const text = document.createTextNode(todo)
    li.appendChild(text)
    document.getElementById('list').appendChild(li)
  })
})

function clearList() {
  document.getElementById('list').innerHTML = ''
  ipcRenderer.send('listClear')
}
