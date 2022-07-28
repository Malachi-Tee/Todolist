// Requiring express
const express = require('express')
// Assigning the express call to the 'app' variable
const app = express()
// Requiring MongoDB
const MongoClient = require('mongodb').MongoClient
// Declaring the PORT variable
const PORT = 2121
// requiring doeenv
require('dotenv').config()


let db, //Declaring an empty db strin
    dbConnectionStr = process.env.DB_STRING, // a connection string variable from .env
    dbName = 'todo' // Declaring the name of the database to the 'dbName' variable

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connecting to the database
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // console logging so we know when we are connected
        db = client.db(dbName)  // assinging the current db to the global db variable
    })
    
app.set('view engine', 'ejs') // settinng the view engine to ejs
app.use(express.static('public')) // settig up the public folder for 'public files' / files that dont need to be private or hidden
app.use(express.urlencoded({ extended: true })) // Tell express to encode and decode URLS automatically
app.use(express.json()) // Tells express to use JSON


app.get('/',async (request, response)=>{ // Waiting for and responding to get requests with the '/' path
    const todoItems = await db.collection('todos').find().toArray() // getting todo items from the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // gettign items with a 'completed' value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sending the data(itemsL todoItmes and left: itemsleft) to ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Waiting for and responding to post requests with the '/addTodo' path
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Adding a new todo item to the database 
    .then(result => {
        console.log('Todo Added') // console logging that the todo was added
        response.redirect('/') // responding to the client by sending them to the home page
    })
    .catch(error => console.error(error)) // console logging any errors
})

app.put('/markComplete', (request, response) => { // Waiting and responding to put requests with the '/markComplete' path
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // finding the 'thing' with the correct request.body
        $set: { 
            completed: true // setting its completed value to true
          }
    },{
        sort: {_id: -1}, // sorting by oldest first
        upsert: false // if the document doesnt exist don't make one
    })
    .then(result => {
        console.log('Marked Complete') // console logging that its been marked complete
        response.json('Marked Complete') //  responding to the the client with JSON
    })
    .catch(error => console.error(error)) // console logging any errors

})

app.put('/markUnComplete', (request, response) => { // Waiting and responding to put requests with the '/markUnComplete' path
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // finding the 'thing' with the correct request.body
        $set: {
            completed: false // setting its completed value to false
          }
    },{
        sort: {_id: -1}, // sorting by oldest first
        upsert: false // if the document doesnt exist don't make one
    })
    .then(result => {
        console.log('Marked Complete') // console logging that its been marked complete
        response.json('Marked Complete') //  responding to the the client with JSON
    })
    .catch(error => console.error(error)) // console logging any errors

})

app.delete('/deleteItem', (request, response) => { // Waiting and responding to delete requests with the '/deleteItem' path
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // finding the 'thing' with the correct request.body and deletes it from database
    .then(result => {
        console.log('Todo Deleted') // console logging that its been deleted 
        response.json('Todo Deleted') //  responding to the the client with JSON
    })
    .catch(error => console.error(error)) // console logging any errors

})

app.listen(process.env.PORT || PORT, ()=>{ // listeing for the PORT to start running
    console.log(`Server running on port ${PORT}`) // console logs that the port is running and shows you the port
})