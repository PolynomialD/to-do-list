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

function deleteItem(index) {
  ipcRenderer.send('todo:deleteItem', index)
}

ipcRenderer.on('todo:updated', (event, list) => {
  document.getElementById('list').innerHTML = ''
  list.forEach((todo, index) => {
    const deleteButton = document.createElement('button')
    const buttonText = document.createTextNode('delete')
    deleteButton.appendChild(buttonText)
    deleteButton.setAttribute('onclick', `deleteItem(${index})`)

    const li = document.createElement('li')
    const text = document.createTextNode(todo)
    li.appendChild(text)
    li.appendChild(deleteButton)
    document.getElementById('list').appendChild(li)

    
  })
})

function clearList() {
  document.getElementById('list').innerHTML = ''
  ipcRenderer.send('listClear')
}
