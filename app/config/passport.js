const LocalStrat = require('passport-local').Strategy

const User = require('../models/users')

const bcrypt = require('bcrypt')

function init(passport){
    passport.use(new LocalStrat ({usernameField: 'email'}, async (email , password , done) =>{
        //Login
        //check if email exaist
        const user = await User.findOne({email:email})
        if(!user){
            return done(null, false, {message : 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match =>{
            if(match){
                return done(null, user,  {message : 'Logged in succesfully'})

            }
            return done(null, false,  {message : 'Wrong username and password'})

        }).catch(err => {
            return done(null, false,  {message : 'Something went wrong'})
        })
    }))
   
    passport.serializeUser((user,done) =>{
        done(null, user._id)
    })

    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) =>{
            done(err,user)
        })
    })
     
}


module.exports = init
