require('dotenv').config()
const express = require('express')
const router  = express.Router()
const db = require('../models')
const myKey = process.env.API_KEY;
const axios = require('axios')

router.get('/', (req, res) => {
    const url = `http://www.omdbapi.com/?apikey=${myKey}&s=${req.query.s}`
    axios.get(url)
    .then(resposne => {
        res.render('movies/result', {
            input: req.query.s,
            movies: resposne.data.Search
        })
    })
    .catch(console.warn)
})


router.get('/:movie_id', async (req, res) => {
    const url = `http://www.omdbapi.com/?apikey=${myKey}&i=${req.params.movie_id}`
    const movie = await axios.get(url)
    const comment = await db.comment.findAll({
        where: {
            imdbId : req.params.movie_id
        },
        include: [db.user]
    })
    console.log(comment.user)
    res.render('movies/detail', {
            movie: movie.data,
            comments: comment
        })
  })



module.exports = router