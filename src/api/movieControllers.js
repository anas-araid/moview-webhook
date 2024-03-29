"use strict";

require("dotenv").config();
const axios = require("axios");
var fs = require("fs");

const TMDB_KEY = process.env.TMDB_KEY;
// contiene tutti i generi da tmdb
//const GENRES = JSON.parse(fs.readFileSync('./src/api/data/genres.json', 'utf8'));

module.exports = {
  LANGS: JSON.parse(fs.readFileSync('./src/api/data/langs.json', 'utf8')),
  // restituisce un film casuale -- FUNZIONE OBSOLETA
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
  getMovie: async function (params, page) {
    let query = await this.handleParameters(params);
    if (query === undefined) {
      return new Promise(function (resolve) {
        resolve(undefined);
      });
    }
    return axios.get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
      TMDB_KEY +
      "&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=" + page + "" +
      query
    );
  },
  getLang: function (params) {
    // this.LANGS è un json con tutte le lingue
    for (let i = 0; i < this.LANGS.length; i++) {
      for (let x = 0; x < this.LANGS[i].languages.length; x++) {
        if (this.LANGS[i].languages[x].name.toLowerCase() === params.toLowerCase()) {
          // restituisce l'iso della lingua
          return this.LANGS[i].languages[x].iso639_1;
        }
      }
    }
  },
  // restituisce una parte della query finale (attori, regista e keywords)
  handleParameters: async function (params) {
    if (params.country !== "") {
      return undefined
    }
    var actors = "&with_cast=";
    // per ogni attore richiede il suo l'id dall'api (serve poi per costruire la query)
    for (let i = 0; i < params.actor.length; i++) {
      await this.getPerson(params.actor[i].name)
        .then((res) => {
          if (res.data.results.length > 0 && typeof res.data.results !== 'undefined'){
            actors += res.data.results[0].id + ",";
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (params.actor.length !== 0 && actors === "&with_cast=") {
      return undefined;
    }
    // se non ci sono attori, rimuove il carattere '=' dalla stringa
    if (actors.charAt(actors.length - 1) !== "=") {
      actors = actors.slice(0, -1);
    }
    var director = "&with_crew=";
    if (params.director !== "") {
      await this.getPerson(params.director.name)
        .then((res) => {
          if (res.data.results[0].known_for_department === "Directing") {
            director += res.data.results[0].id;
          }
          else {
            director = "STOP";
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (director === "STOP") {
      return undefined;
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
    if (params["keywords_1.original"].length != 0 && keywords == "&with_keywords=") {
      return undefined;
    }
    if (keywords.charAt(keywords.length - 1) !== "=") {
      keywords = keywords.slice(0, -1);
    }
    var genres = "&with_genres=";
    await this.getGenres()
      .then((res) => {
        console.log(res.data)
        for (let i = 0; i < params.genre.length; i++) {
          var genreName =
            params.genre[i].charAt(0).toUpperCase() +
            params.genre[i].substring(1);
          genreName = this.titleCase(genreName)
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
    if (params.genre.length != 0 && genres == "&with_genres=") {
      return undefined
    }
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
      runtime += (params.duration.unit === "h") ? params.duration.amount * 60 : params.duration.amount;
    }

    var language = "&with_original_language=";
    if (params.language !== "") {
      language += this.getLang(params.language)
    }
    if (params.language != "" && language == "&with_original_language=") {
      return undefined;
    }
    if (year == "&primary_release_year=" && decade == "&primary_release_date.gte=&primary_release_date.lte=") {
      var tmp = new Date()
      decade += (tmp.getFullYear() + "-" + (tmp.getMonth() + 1 < 10 ? '0' + (tmp.getMonth() + 1) : tmp.getMonth() + 1) + "-" + (tmp.getDate() < 10 ? '0' + tmp.getDate() : tmp.getDate()));
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
    return query;
  },
  titleCase: function (str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
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
    var isCorrect = false;
    while (!isCorrect) {
      let random = Math.floor(Math.random() * res.length);
      let isDirector = false;
      if (res.length == 0) {
        return undefined;
      }
      await this.getMovieCredits(res[random].id)
        .then((response) => {
          for (let i = 0; i < response.data.crew.length; i++) {
            if (
              response.data.crew[i].job == "Director" &&
              response.data.crew[i].name.toLowerCase().includes(dir)
            ) {
              isDirector = true;
              result = res[random];
              isCorrect = true;
              break;
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
      if (!isDirector) {
        res.splice(random, 1);
      }
    }
    return result;
  }
};
