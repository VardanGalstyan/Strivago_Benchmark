import express from "express"
import UserModel from "./schema.js"
// import { basicAuthMiddleware } from "../../auth/basic.js"
// import { JWTAuthMiddleware } from "../../auth/token.js"
// import { adminOnlyMiddleware } from "../../auth/admin.js"
// import { JWTAuthenticate } from "../../auth/tools.js"
import { generateJWToken } from "../../auth/tools.js"
import createHttpError from "http-errors"

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


usersRouter.get("/",
  // JWTAuthMiddleware, 
  async (req, res, next) => {
    try {
      const users = await UserModel.find()
      res.send(users)
    } catch (error) {
      next(error)
    }
  })

usersRouter.get("/me",
  // JWTAuthMiddleware, 
  async (req, res, next) => {
    // JWTAuthMiddleware is going also to modify req object and attach the "logged in" user to it --> req.user
    try {
      res.send(req.user)
    } catch (error) {
      next(error)
    }
  })

usersRouter.put("/me",
  // JWTAuthMiddleware, 
  async (req, res, next) => {
    try {
      req.user.name = "John"

      await req.user.save()
      res.send()
    } catch (error) {
      next(error)
    }
  })

usersRouter.delete("/me",
  // JWTAuthMiddleware, 
  async (req, res, next) => {
    try {
      await req.user.deleteOne()
      res.send()
    } catch (error) {
      next(error)
    }
  })

usersRouter.get("/:userId",
  // JWTAuthMiddleware, 
  // adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId)
      res.send(user)
    } catch (error) {
      next(error)
    }
  })



export default usersRouter