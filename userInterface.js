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

function editItem(index) {
  const value = document.getElementById(`newInput-${index}`).value
  const data = {
    index: index,
    value: value
  }
  if(value !== '') {
    ipcRenderer.send('todo:editItem', data)
  }
}

function markDone(index) {
  ipcRenderer.send('todo:markDone', index)
}

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


    const newInput = document.createElement('input')
    newInput.setAttribute('id', `newInput-${index}`)

    const saveButton = document.createElement('button')
    const saveButtonText = document.createTextNode('save')
    saveButton.appendChild(saveButtonText)
    saveButton.setAttribute('onclick', `editItem(${index})`)

    const doneButton = document.createElement('button')
    const doneButtonText = document.createTextNode('done')
    doneButton.appendChild(doneButtonText)
    doneButton.setAttribute('onclick', `markDone(${index})`)

    const li = document.createElement('li')
    const text = document.createTextNode(`${todo.name} (${todo.status})`)
    li.appendChild(text)
    li.appendChild(deleteButton)
    li.appendChild(saveButton)
    li.appendChild(newInput)
    li.appendChild(doneButton)
    document.getElementById('list').appendChild(li)

    
  })
})

function clearList() {
  document.getElementById('list').innerHTML = ''
  ipcRenderer.send('listClear')
}
