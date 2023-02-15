const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const itemFilter = document.getElementById('filter')
const clearBtn = document.getElementById('clear')
const formBtn = itemForm.querySelector('button')
let isEditMode = false

function displayItems() {
  const itemsFromStorage = getItemsFromStorage()
  itemsFromStorage.forEach(item => addItemToDOM(item))
  checkUI()
};

function onAddItemSubmit(e) {
  e.preventDefault()
  const newItem = itemInput.value

  // Validate Input
  if (newItem === '') {
    alert('Please add an item')
    return
  }

  // Check for Edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode')

    removeItemFromStorage(itemToEdit.textContent)
    itemToEdit.classList.remove('edit-mode')
    itemToEdit.remove()
    isEditMode = false
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item alreay exists')
      return
    }
  }

  // Add item to dom
  addItemToDOM(newItem)

  // Add item to local storage
  addItemtoStorage(newItem)

  // Check UI
  checkUI()

  itemInput.value = ''
};

function addItemToDOM(item) {

   // Create List Item
   const li = document.createElement('li')
   li.appendChild(document.createTextNode(item))
 
   const button = createButton('remove-item btn-link text-red')
   li.appendChild(button)
 
   itemList.appendChild(li)  

};

function addItemtoStorage(item) {
  let itemsFromStorage = getItemsFromStorage()

  // Add new item
  itemsFromStorage.push(item)

  // Convert to JSON String and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))

};

// Get Items from Storage
function getItemsFromStorage() {
  let itemsFromStorage

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = []
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'))
  }
  return itemsFromStorage
};

// Create Button
function createButton(classes) {
  const button = document.createElement('button')
  button.className = classes
  const icon = createIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
};

// Create Icon
function createIcon(classes) {
  const icon = document.createElement('i')
  icon.className = classes
  return icon
};

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
     removeItem(e.target.parentElement.parentElement)
  } else {
    setItemToEdit(e.target)
  }
};

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage()
  return itemsFromStorage.includes(item)
}

function setItemToEdit(item) {
  isEditMode = true

  // Reset List
  itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))

  item.classList.add('edit-mode')

  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent
}

function removeItem(item) {
    if (confirm('Are you Sure?')) {

      // Remove Item from DOM
      item.remove();

      // Remove item from Storage
      removeItemFromStorage(item.textContent);

      checkUI()
    }
};

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage()

  // Filter out
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Save to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild)
  }

  // Clear from localstorage
  localStorage.removeItem('items');

  checkUI()
};

function filterItems(e) {
  const items = itemList.querySelectorAll('li')
  const text = e.target.value.toLowerCase()

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase()
    
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex'
    } else {
      item.style.display = 'none'
    }

  })
  
};

function saveItems() {
  const items = itemList.querySelectorAll('li')
};

function checkUI() {
  itemInput.value = ''

  const items = itemList.querySelectorAll('li')
  if (items.length === 0) {
    clearBtn.style.display = 'none'
    itemFilter.style.display = 'none'
  } else {
    clearBtn.style.display = 'block'
    itemFilter.style.display = 'block'
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
  formBtn.style.backgroundColor = '#333'

  isEditMode = false
};

// Initialize App
function init() {
  // Event Listners
  itemForm.addEventListener('submit', onAddItemSubmit)
  itemList.addEventListener('click', onClickItem)
  clearBtn.addEventListener('click', clearItems)
  itemFilter.addEventListener('input', filterItems)
  document.addEventListener('DOMContentLoaded', displayItems)
};

init()
