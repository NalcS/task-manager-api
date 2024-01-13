const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)






/*const cleaning = new Task({
    description: "Brush my teeth   ",
})

cleaning.save().then(()=>console.log(cleaning)).catch(err=>console.log(err))*/