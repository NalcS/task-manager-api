const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require("./task")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Stupid Fucking Name",
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0){
                throw new Error("Age must be a positive number")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Not valid Email!")
            }
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            /*if(!value.length>6){
                throw new Error("Password needs to be longer than 6 characters")
            }
            else*/ if (value.toLowerCase().includes("password")){
                throw new Error("Password shall not contain \"password\"")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user){
        throw new Error("Wrong email")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Wrong password")
    }

    return user
}

//Hash password
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user when user is removed
userSchema.pre('deleteOne', async function(next) {
    const user = this
    const restur = await Task.deleteMany({ owner: user._id })
    console.log(restur)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User