const deleteBtn = document.querySelectorAll('.fa-trash') // storing documents with the fa-trash class storing in a node list
const item = document.querySelectorAll('.item p') // storing documents with the .item p class and element storing in a node list
const itemCompleted = document.querySelectorAll('.item span.completed') // storing documents with the .item span.completed class storing in a node list

Array.from(deleteBtn).forEach((element)=>{  //Creating an aray from deleteBtn and adding an event listener to all of them that calls the deleteItem function
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ //Creating an aray from item and adding an event listener to all of them that calls the markComplete function
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{  //Creating an aray from itemCompleted and adding an event listener to all of them that calls the markUnComplete function
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ // asynnc function to delete a todo item
    const itemText = this.parentNode.children[0].innerText //adds the item we want to deleete to the variable itemText
    try{
        const response = await fetch('deleteItem', { //Sendig a response with the delete method
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ // keying the itemText to itemFromJS
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //waiting for server response
        console.log(data) // console logging the data
        location.reload() // reloading the page

    }catch(err){
        console.log(err) // error catch
    }
}

async function markComplete(){ // async function to mark something as complete
    const itemText = this.parentNode.children[0].innerText // targetting a specfic text and storing it to the variable
    try{
        const response = await fetch('markComplete', { // sending a fetch with a put method
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText 
            })
          })
        const data = await response.json() //waiting for server response
        console.log(data) // console logging the data
        location.reload() // reloading the page


    }catch(err){
        console.log(err) // error catch console log
    }
}

async function markUnComplete(){ //async function that marks somethign as uncomplete
    const itemText = this.parentNode.children[0].innerText // targetting a specfic text and storing it to the variable
    try{
        const response = await fetch('markUnComplete', { // sending a fetch with a put method
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //waiting for server response
        console.log(data) // console logging the data
        location.reload() // reloading the page

    }catch(err){
        console.log(err) // error catch console log
    }
}