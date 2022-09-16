require('dotenv').config()
const express = require('express')
const router  = express.Router()
const db = require('../models')
const myKey = process.env.API_KEY;
const axios = require('axios')

router.post('/', async (req, res) => {
    if (!res.locals.user) {
        res.redirect('/users/login?message=Please log in to proceed')
    } else {
        const comment = await db.comment.create({
            content: req.body.comment,
            imdbId : req.body.movieId
        })
        res.locals.user.addComment(comment)
        res.redirect(`/movies/${comment.imdbId}`)
    }
})


module.exports = router;