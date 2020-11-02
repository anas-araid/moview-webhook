'use strict';

require('dotenv').config();
const axios = require('axios');
const TMDB_APIKEY = process.env.TMDB_KEY;

module.exports = {
  getMovieByGenre : function(genre){
    
  },
  getMovieByYear : function(year){
    let query = 'https://api.themoviedb.org/3/discover/movie?api_key='+TMDB_APIKEY+'&year='+year;
    return axios.get(query);
  },
  getMovieByKeyword : function(keyword){

  },
  getMovieByDuration : function(duration){

  }
  // ECC.
}