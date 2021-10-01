import express from "express"
import UserModel from "./schema.js"
import AcomModel from "../Accommodation/schema.js"
import { generateJWToken } from "../../auth/tools.js"
import { JWTAuthMiddleWear } from "../../auth/token.js"
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


usersRouter.get("/me", JWTAuthMiddleWear, async (req, res, next) => {
  try {
    res.send(req.user)
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

  usersRouter.get("/me/accomodation", JWTAuthMiddleWear, async (req, res, next) => {
    try {
        console.log(req.user._id)
    const Accom = await AcomModel.find({ host: req.user._id})
    .populate('host')
    .exec(function(err, posts, count){  
     res.send(posts)
  });


    
    } catch (error) {
      next(error)
    }
  })



export default usersRouter