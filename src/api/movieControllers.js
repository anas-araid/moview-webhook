"use strict";

require("dotenv").config();
const axios = require("axios");
const { query } = require("express");
const TMDB_KEY = process.env.TMDB_KEY;

module.exports = {
  // restituisce un film casuale
  getRandomMovie: function () {
    // random tra il 1935 e l'anno corrente
    let fistYear = 1935;
    let randomYear = Math.floor(
      Math.random() * (new Date().getFullYear() - fistYear) + fistYear
    );
    // random tra 1 e 5
    let randomPage = Math.floor(Math.random() * 5 + 1);
    // restituisce una serie di film con un anno a caso e la pagina a caso
    let query =
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
      TMDB_KEY +
      "&language=en-US&sort_by=popularity.desc&vote_count.gte=500&year=" +
      randomYear +
      "&page=" +
      randomPage;
    return axios.get(query);
  },
  //restituisce i dettagli di un attore/regista 
  getPerson: function (params) {
    return axios.get(
      "https://api.themoviedb.org/3/search/person?api_key=" +
        TMDB_KEY +
        "&language=en-US&page=1&include_adult=false&query=" +
        params
    );
  },
  // restituisce le keyword in base al parametro passato
  getKeyword: function (params) {
    return axios.get(
      "https://api.themoviedb.org/3/search/keyword?api_key=" +
        TMDB_KEY +
        "&language=en-US&page=1&include_adult=false&query=" +
        params
    );
  },
  // esegue la query costruita nella funzione handleParameters
  getMovie: async function (params) {
    let query = await this.handleParameters(params);
    return axios.get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        TMDB_KEY +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1" +
        query
    );
  },
  // restituisce una parte della query finale (attori, regista e keywords)
  handleParameters: async function (params) {
    var actors = "&with_cast=";
    // per ogni attore richiede il suo l'id dall'api (serve poi per costruire la query)
    for (let i = 0; i < params.actor.length; i++) {
      await this.getPerson(params.actor[i].name)
        .then((res) => {
          actors += res.data.results[0].id + ",";
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // se non ci sono attori, rimuove il carattere '=' dalla stringa
    if (actors.charAt(actors.length - 1) !== "=") {
      actors = actors.slice(0, -1);
    }
    var director = "&with_crew=";
    await this.getPerson(params.director.name)
      .then((res) => {
        director += res.data.results[0].id;
      })
      .catch((err) => {
        console.error(err);
      });
    console.log("linea 81 - director: " + director);
    var keywords = "&with_keywords=";
    for (let i = 0; i < params.keywords_1.length; i++) {
      await this.getKeyword(params.keywords_1[i])
        .then((res) => {
          let kw = res.data.results.filter(function (value) {
            return value.name == params.keywords_1[i];
          });
          if (kw.length !== 0) {
            keywords += kw[0].id + ",";
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (keywords.charAt(keywords.length - 1) !== "=") {
      keywords = keywords.slice(0, -1);
    }
    var query = actors + keywords + director;
    console.log("linea 101 - query: " + query);
    return query;
  },
  getMovieByYear: function (year) {
    let query =
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
      TMDB_KEY +
      "&year=" +
      year;
    return axios.get(query);
  },
  getMovieByDuration: function (duration) {},
  // ECC.
};
