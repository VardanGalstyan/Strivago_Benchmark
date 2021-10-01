import GoogleStrategy from 'passport-google-oauth20'
import UserModel from '../services/Users/schema.js'
import { generateJWToken } from './tools.js'
import passport from 'passport'


const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/users/googleRedirect`
}, async (accessToken, refreshToken, profile, passportNext) => {
    try {
        const user = await UserModel.findOne({ googleId: profile.id })
        if (user) {
            const tokens = await generateJWToken(user)
            passportNext(null, { tokens })
           
        } else {
            const newUser = {
                name: profile.name.givenName + " " + profile.name.familyName,
                role: "Host",
                googleId: profile.id,
                email: profile.emails[0].value
            }
            const createdUser = new UserModel(newUser)
            const savedUser = await createdUser.save()
            const tokens = await generateJWToken(savedUser)
            passportNext({ user: savedUser, tokens })

        }

    } catch (error) {
        console.log(error);
        passportNext(error)
    }
})

passport.serializeUser(function (user, passportNext) {
    passportNext(null, user)
})


export default googleStrategy