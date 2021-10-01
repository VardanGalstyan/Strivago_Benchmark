import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: false },
    role: { type: String, required: true, enum: ["Host", "Guest"], default: "Guest" },
    googleId: { type: String, required: false }
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  const newUser = this
  const plainPW = newUser.password

  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})


UserSchema.methods.toJSON = function () {
  // toJSON is called every time express does a res.send of the documents, this is not going to affect the db

  const userDocument = this

  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  // userObject.newProperty = "ashdasdsadas" if you want you can also add new properties to the returned objects
  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {

  const user = await this.findOne({ email })

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)
    if (isMatch) return user
    else return null
  } else {
    return null
  }
}

export default model("User", UserSchema)
