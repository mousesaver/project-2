//  require packages
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')
const axios = require('axios')
const myKey = process.env.API_KEY;


// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static('static'));
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
// Generate home page with 10 preselected movies from 2022
const popularMovieId = ["tt1745960", "tt9419884", "tt8041270", "tt1877830", "tt5113044", "tt10648342", "tt12412888", "tt3704428", "tt1464335"]
async function extractMovie(arr,id) {
    try {
        const url = `http://www.omdbapi.com/?apikey=${myKey}&i=${id}`
        const response = await axios.get(url)
        arr.push(response.data)   
    } catch(err) {
        console.log(err)
    }
}
let preselectedMovies = []
async function extractMovie2() {
    for (let i = 0; i < popularMovieId.length; i++) {
        await extractMovie(preselectedMovies,popularMovieId[i])
    }
    app.get('/', (req, res) =>{
        // console.log('incoming cookie 🍪', req.cookies)
        // console.log(res.locals.myData)
        res.render("home", {
            movies: preselectedMovies
        })
    })
}
extractMovie2()

// route definition
app.get('/', async (req, res) =>{
    let user = null
    if (res.locals.user) {
        user = await db.user.findOne({
            where: {
                id : res.locals.user.id
            },
            include: [db.watchedmovie, db.watchlist]
        })
    }
    res.render("home", {
        movies: preselectedMovies,
        user: user 
    })
})


// controllers
app.use('/users', require('./controllers/users'))
app.use('/movies', require('./controllers/movies'))

// listen to a port
app.listen(PORT, () => {
    console.log(`Conneted to port ${PORT}`)
})

