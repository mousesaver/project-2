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


router.get('/:movie_id', (req, res) => {
    const url = `http://www.omdbapi.com/?apikey=${myKey}&i=${req.params.movie_id}`
    axios.get(url)
    .then(resposne => {
        res.render('movies/detail', {
            movie: resposne.data
        })
    })
    .catch(console.warn)
  })



module.exports = router