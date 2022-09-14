require('dotenv').config()
const express = require('express')
const router  = express.Router()
const db = require('../models')
const myKey = process.env.API_KEY;
const axios = require('axios')
router.get('/:movie_id', (req, res) => {
    const url = `http://www.omdbapi.com/?apikey=${myKey}&i=${req.params.movie_id}`
    axios.get(url)
    .then(resposne => {
        console.log(resposne.data)
        res.render('movies/detail', {
            movies: resposne.data
        })
    })
    .catch(console.warn)
  })










module.exports = router;