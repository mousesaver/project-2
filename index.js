//  require packages
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')

// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
// Our customer auth middleware
app.use(async (req, res, next) => {
    // res.locals.myData = 'hello, fellow route'
    // console.log('hello from a middleware')
    // if there is a cookie on the incoming request
    if (req.cookies.userId) {
        const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
        const user = await db.user.findByPk(decryptedIdString)
        res.locals.user = user
    } else {
        res.locals.user = null
    }
    // move on to the next route or middleware in the chain
    next()
})


// route definition
app.get('/', (req, res) =>{
    // console.log('incoming cookie 🍪', req.cookies)
    // console.log(res.locals.myData)
    console.log('The currently logged user is ', res.locals.user)
    res.render("home")
})

// controllers
app.use('/users', require('./controllers/users'))

// listen to a port
app.listen(PORT, () => {
    console.log(`Conneted to port ${PORT}`)
})