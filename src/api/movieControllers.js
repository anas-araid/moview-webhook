'use strict';

require('dotenv').config();
const axios = require('axios');
const TMDB_KEY = process.env.TMDB_KEY;

module.exports = {
  getRandomMovie : function(){
    // random tra il 1935 e l'anno corrente
    let fistYear = 1935;
    let randomYear = Math.floor((Math.random() * (new Date().getFullYear() - fistYear)) + fistYear);
    // random tra 1 e 5
    let randomPage = Math.floor((Math.random() * 5) + 1);
    // restituisce una serie di film con un anno a caso e la pagina a caso 
    let query = 'https://api.themoviedb.org/3/discover/movie?api_key='+TMDB_KEY+'&language=en-US&sort_by=popularity.desc&year='+randomYear+'&page='+randomPage;
    return axios.get(query);
  },
  getMovieByGenre : function(genre){
    
  },
  getMovieByYear : function(year){
    let query = 'https://api.themoviedb.org/3/discover/movie?api_key='+TMDB_KEY+'&year='+year;
    return axios.get(query);
  },
  getMovieByKeyword : function(keyword){

  },
  getMovieByDuration : function(duration){

  }
  // ECC.
}