const express = require('express')
const router  = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')
const myKey = process.env.API_KEY;
// GET /users/new -- render a form to create a new user
router.get('/new', (req, res) => {
    
    res.render('users/new')
})
// POST/users -- create a new user in the db
router.post('', async (req, res) => {
    // console.log(req.body)
    // res.send('create a new user in the db')
    try {
        // create a new user
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        const [user, created] = await db.user.findOrCreate({
            where :{
                email: req.body.email
            },
            defaults: {
                name: req.body.name,
                password: hashedPassword,
                country: req.body.country
            }    
        })
        if (!created) {
            res.redirect('/users/login?message=You already have an account. Please log in')
        } else {
            // store that new user's id as a cookie in the browser
            const encryptedId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptUserIdString = encryptedId.toString()
            res.cookie('userId', encryptUserIdString)
            // redirect tp the homepage
            res.redirect('/users/profile')
        }
        
    } catch(err) {
        console.log(err)
    } 
})
// GET /users/login -- shows a login form to the user
router.get('/login', (req, res) => {
    res.render('users/login', {
        message: req.query.message ? req.query.message : null
    })
})
// POST / users/login -- accept a payload of form data and use it log a user in
router.post('/login', async (req, res) => {
    try {
        // look uo the user in the db using the supplied email
        const user = await db.user.findOne({
            where : {
                email: req.body.email
            }
        })
        const message = "Incorrect username or password"
        if (!user) {
            // console.log('message')
            res.redirect('/users/login?message=' + message)
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            // console.log('message')
            res.redirect('/users/login?message=' + message)
        } else {
            const encryptedId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptUserIdString = encryptedId.toString()
            res.cookie('userId', encryptUserIdString)
            res.redirect('/users/profile')
        }
    } catch (err) {
        console.log(err)
        res.send('server eror')
    }
})
// GET /users/logout -- log out a user by clearing the stored cookie
router.get('/logout', (req, res) => {
    // clear the cookie
    res.clearCookie('userId')
    res.redirect('/')
})
router.get('/profile', (req, res) => {
    // if the user is not logged ... we need to redirect to the login form
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
    } else {
        res.render('users/profile', {
            user: res.locals.user
        })
    }
})
async function extractMovie(id) {
    try {
        const url = `http://www.omdbapi.com/?apikey=${myKey}&i=${id}`
        const response = await axios.get(url)
        return response.data   
    } catch(err) {
        console.log(err)
    }
}
router.post('/watched', async (req, res) => {
    if (!res.locals.user) {
        res.redirect('/users/login?message=Please log in to proceed')
    } else {
        const specificMovie = await extractMovie(req.body.movieId)
        const [movie, created] = await db.watchedmovie.findOrCreate({
            where : {
                imdbId : req.body.movieId
            },
            defaults: {
                name: specificMovie.Title,
                genre: specificMovie.Genre,
                poster: specificMovie.Poster,
                director: specificMovie.Director
            }
        })
        if (created) {
            res.locals.user.addWatchedmovie(movie)
        }
        res.redirect(`/movies/${movie.imdbId}`)
    }
})
router.post('/watched/undo', (req, res) => {
    if (!res.locals.user) {
        res.redirect('/users/login?message=Please log in to proceed')
    } else {
        await db.watchedmovie.destroy({
            where : {
                imdbId : req.body.movieId
            }
        })
        if (created) {
            res.locals.user.addWatchedmovie(movie)
        }
        res.redirect(`/movies/${movie.imdbId}`)
    }
})
router.post('/watchlist', (req, res) => {
    res.send('Add to watchlist');
})
router.post('/watchlist/undo', (req, res) => {
    res.send('Add to watchlist undo');
})
module.exports = router;