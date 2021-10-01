import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const { Schema, model } = mongoose

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: false },
    avatar: { type: String, required: false },
    googleId: {type: String, required: false }
},
    {
        timestamps: true
    })


// // Encrypting the password
// userSchema.pre('save', async function (next) {
//     const newUser = this
//     const plainPW = newUser.password

//     if (newUser.isModified("password")) {
//         newUser.password = await bcrypt.hash(plainPW, 10)
//     }
//     next()
// })

// // removing unnecessary values
// userSchema.methods.toJSON = function () {
//     const userDocument = this
//     const userObject = userDocument.toObject()
//     delete userObject.password
//     delete userObject.__v
//     return userObject
// }

// userSchema.statics.checkCredentials = async function (username, plainPW) {
//     const user = await this.findOne({ username })
//     if (user) {
//         const isMatch = await bcrypt.compare(plainPW, user.password)
//         if (isMatch) return user
//         else return null
//     } else {
//         return null
//     }
// }


export default model("User", userSchema)

