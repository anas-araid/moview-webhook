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
  getGenres: function () {
    return axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
        TMDB_KEY +
        "&language=en-US"
    );
  },
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
    console.log(params);
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
    if (params.director !== "") {
      await this.getPerson(params.director.name)
        .then((res) => {
          if (res.data.results[0].known_for_department == "Directing") {
            director += res.data.results[0].id;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

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
    var genres = "&with_genres=";
    await this.getGenres()
      .then((res) => {
        for (let i = 0; i < params.genre.length; i++) {
          var genreName =
            params.genre[i].charAt(0).toUpperCase() +
            params.genre[i].substring(1);
          for (let x = 0; x < res.data.genres.length; x++) {
            if (genreName === res.data.genres[x].name) {
              genres += res.data.genres[x].id + ",";
            }
          }
        }
        if (genres.charAt(genres.length - 1) !== "=") {
          genres = genres.slice(0, -1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(genres);
    var query = actors + keywords + director + genres;

    return query;
  },
  getMovieCredits: function (id) {
    return axios.get(
      "https://api.themoviedb.org/3/movie/" +
        id +
        "/credits?api_key=" +
        TMDB_KEY
    );
  },
  checkDirectors: async function (res, agent) {
    var results = [];
    var len = res.data.results.length > 5 ? 5 : res.data.results.length;
    let counter = 0;
    while (results.length != len) {
      if (counter == len) {
        break;
      } else {
        await this.getMovieCredits(res.data.results[counter].id)
          .then((response) => {
            console.log(response.data.id);
            for (let i = 0; i < response.data.crew.length; i++) {
              if (
                response.data.crew[i].job == "Director" &&
                response.data.crew[i].name
                  .toLowerCase()
                  .includes(agent.parameters.director.name)
              ) {
                console.log(response.data.crew[i].name + " is the director!!!");
                results.push(res.data.results[counter]);
                break;
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
      counter++;
    }
    //console.log(results);
    return results;
  },
  // getMovieByYear: function (year) {
  //   let query =
  //     "https://api.themoviedb.org/3/discover/movie?api_key=" +
  //     TMDB_KEY +
  //     "&year=" +
  //     year;
  //   return axios.get(query);
  // },
  // getMovieByKeyword: function (keyword) {},
  // getMovieByDuration: function (duration) {},
  // ECC.
};
