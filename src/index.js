const express = require('express')
require('./db/mongoose')

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT


//Maintenance mode:
/*app.use((req, res, next) => {
    res.status(503).send("Server is in maintenance mode, please try again later!")
})*/




app.use(express.json())

app.use(userRouter)
app.use(taskRouter)


//
// Without middleware: new request -> run route handler
//
// With middleware:    new request -> do something -> run route handler
//




app.listen(port, () => {
    console.log("Server is up on port ", port)
})



/*const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    const task = await Task.findById('65a17bd70109ed8358963506')
    await task.populate('owner')
    console.log(task.owner)

    const user = await User.findById("65a179333321afdb13e114b7")
    console.log(user)
    await user.populate('tasks')
    console.log(user.tasks)
}

main()*/