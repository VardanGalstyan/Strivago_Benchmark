import createHttpError from 'http-errors'
import { verifyJWT } from './tools.js'
import UserModel from '../services/Users/schema.js'


export const JWTAuthMiddleWear = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createHttpError(401, "Please provide credentials in Authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decodedToken = await verifyJWT(token)
            const user = await UserModel.findById(decodedToken._id)
            if (user) {
                req.user = user
                next()
            } else {
                next(createHttpError(404, `No User with id # ${decodedToken._Id} has been found!`))
            }
        } catch (error) {
            next(createHttpError(401, "Invalid Token!"))
        }
    }
}