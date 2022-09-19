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
router.delete('/:imdbId', async (req, res) => {
    await db.comment.destroy({
        where : {
        id : req.body.commentId
        }
    })
    res.redirect(`/movies/${req.params.imdbId}`)
})

router.get('/edit/:movie_id', async (req, res) => {
    const comment = await db.comment.findByPk(req.query.commentId)
    const url = `http://www.omdbapi.com/?apikey=${myKey}&i=${req.params.movie_id}`
    const movie = await axios.get(url)
    console.log(movie.data)
    if (!res.locals.user || !res.locals.user.hasComment(comment)) {
        res.redirect('/')
    } else {
        res.render('comments/edit', {
            comment: comment,
            movie: movie.data
        })
    }
})
router.put('/', async (req, res) => {
    const comment = await db.comment.update({
        content: req.body.comment
    }, {
        where: {
            id: req.body.commentId
        }
    })
    console.log(comment)
    res.redirect(`/movies/${req.body.commentimdbId}`)
})


module.exports = router;