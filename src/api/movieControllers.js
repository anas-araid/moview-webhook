"use strict";

require("dotenv").config();
const axios = require("axios");
const { query } = require("express");
var fs = require("fs");

const TMDB_KEY = process.env.TMDB_KEY;
// contiene tutti i generi da tmdb
//const GENRES = JSON.parse(fs.readFileSync('./src/api/data/genres.json', 'utf8'));

module.exports = {
  GENRES: JSON.parse(fs.readFileSync("./src/api/data/genres.json", "utf8")),
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
        "&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1" +
        query
    );
  },
  getCountry: async function (params) {
    return axios.get("https://restcountries.eu/rest/v2/name/" + params);
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
    for (let i = 0; i < params["keywords_1.original"].length; i++) {
      await this.getKeyword(params["keywords_1.original"][i])
        .then((res) => {
          let kw = res.data.results.filter(function (value) {
            return value.name == params["keywords_1.original"][i];
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
    // params.genre.forEach((paramGenre) => {
    //   this.GENRES.forEach((genre) => {
    //     if (paramGenre.toLowerCase() === genre.name.toLowerCase()) {
    //       genres += genre.id + ",";
    //     }
    //   });
    // });
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
    // if (genres.charAt(genres.length - 1) !== "=") {
    //   genres = genres.slice(0, -1);
    // }
    var year = "&primary_release_year=" + params.year;
    var decadeFrom = "&primary_release_date.gte=";
    var decadeTo = "&primary_release_date.lte=";
    if (typeof params["date-period"] === "object") {
      let date1 = params["date-period"].startDate.slice(0, 10);
      let date2 = params["date-period"].endDate.slice(0, 10);
      decadeFrom += date1;
      decadeTo += date2;
    }
    var decade = decadeFrom + decadeTo;

    var runtime = "&with_runtime.lte=";
    if (typeof params.duration === "object") {
      runtime +=
        params.duration.unit === "h"
          ? params.duration.amount * 60
          : params.duration.amount;
    }

    var language = "&with_original_language=";
    if (params.country !== "") {
      await this.getCountry(params.country)
        .then((res) => {
          console.log(res.data[0].languages[0].iso639_1);
          language += res.data[0].languages[0].iso639_1;
        })
        .catch((err) => console.error(err));
    }

    var query =
      actors +
      keywords +
      director +
      genres +
      year +
      decade +
      runtime +
      language;
    console.log(query);
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
  checkDirectors: async function (res, dir) {
    var result;
    //var len = 1;
    //let counter = 0;
    //var countDir = 0;
    var isCorrect = false;
    while (!isCorrect) {
      let random = Math.floor(Math.random() * res.data.results.length);
      let isDirector = false;

      await this.getMovieCredits(res.data.results[random].id)
        .then((response) => {
          console.log(response.data.id);
          for (let i = 0; i < response.data.crew.length; i++) {
            if (
              response.data.crew[i].job == "Director" &&
              response.data.crew[i].name.toLowerCase().includes(dir)
            ) {
              console.log(response.data.crew[i].name + " is the director!!!");
              isDirector = true;
              result = res.data.results[random];
              //countDir++;
              isCorrect = true;
              break;
            } //else {
            //res.data.results.splice(random - 1, 1);
            //}
          }
        })
        .catch((err) => {
          console.error(err);
        });
      if (!isDirector) {
        res.data.results.splice(random, 1);
      }
      //random = Math.floor(Math.random() * res.data.results.length);
      console.log(res.data.results.length);
    }

    //console.log(results);
    return result;
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
