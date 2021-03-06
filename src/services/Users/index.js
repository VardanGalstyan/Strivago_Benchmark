import express from "express"
import UserModel from "./schema.js"
import AcomModel from '../Accommodation/schema.js'
import { generateJWToken } from "../../auth/tools.js"
import { JWTAuthMiddleWear } from "../../auth/token.js"
import createHttpError from "http-errors"
import passport from 'passport'

const usersRouter = express.Router()


usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const savedUser = await newUser.save()
    if (savedUser.role === "Host") {
      const accessToken = await generateJWToken(savedUser)
      res.status(201).send({ savedUser, accessToken })
    } else {
      res.status(201).send(savedUser)
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {

    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      const accessToken = await generateJWToken(user)
      res.send({ accessToken })
    } else {
      next(createHttpError(401, "Credentials are invalid!"))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/googleLogin", passport.authenticate('google', { scope: ["profile", "email"] }))


usersRouter.get("/googleRedirect", passport.authenticate('google'), async (req, res, next) => {
  try {
    res.redirect(`http://localhost:3000/register?accessToken=${req.user.tokens}`)
  } catch (error) {
    next(error);
  }
})


usersRouter.get("/me", JWTAuthMiddleWear, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me/accommodation", JWTAuthMiddleWear, async (req, res, next) => {

  try {
    const data = await AcomModel.find({})
    const userAccommodation = data.filter(value => value.host.toString().includes(req.user._id ))
    res.send(userAccommodation)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/me", JWTAuthMiddleWear, async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(req.user._id, req.body,
      { new: true }
    );
    res.send(updateUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.status(204).send(`The User with ID #${req.params.id} has been successfully deleted!`)
  } catch (error) {
    next(createHttpError(404, `User with id ${req.params.id} has not been found!`))
  }
})

usersRouter.get('/', async (req, res, next) => {
  try {
      const data = await UserModel.find({})
      res.send(data)
  } catch (error) {
      console.log(error);
  }
})



export default usersRouter