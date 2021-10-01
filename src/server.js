import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import usersRouter from "./services/Users/index.js"
import acomRouter from './services/Accommodation/index.js'
import googleStrategy from './auth/oauth.js'
import passport from 'passport'


import { badRequestErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from './services/errorHandlers.js'



const server = express()

passport.use('google', googleStrategy)
server.use(cors())
server.use(express.json())
server.use(passport.initialize())



// R O U T E R S     H E R E 


server.use("/accommodation", acomRouter) 
server.use("/users", usersRouter)


// M I D D L E W A R E S   H E R E

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

const { PORT } = process.env



mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("✅ Successfully connected to MONGO!");
    server.listen(PORT, () => {
        console.log(`✅ Server is up and running on PORT: ${PORT}`)
        console.table(listEndpoints(server))
    })
})

mongoose.connection.on("error", (err) => {
    console.log(`The connection is unsuccessful!, ${err}`);
})