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
    const comments = await db.comment.findAll({
        where: {
            imdbId : req.params.movie_id
        }
    })
    let users = []
    for (let i = 0; i < comments.length; i++) {
        users[i] = await comments[i].getUser()
    }
    res.render('movies/detail', {
            movie: movie.data,
            comments: comments,
            users: users
        })
  })



module.exports = router