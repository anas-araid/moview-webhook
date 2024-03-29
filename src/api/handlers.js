"use strict";
const movieController = require("../api/movieControllers.js");
const { Payload, Card } = require("dialogflow-fulfillment");
require("dotenv").config();

module.exports = {
  errorMsg: function (agent, msg) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text: "<i>" + msg + "</i>",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
    agent.add("Remember that you can ask me to find a movie based on actors, directors, genres and other filters. If you need help just ask!");
  },
  fallbackHandler: function (agent) {
    agent.add(agent.request_.body.queryResult.fulfillmentText);
  },
  startHandler: async function (agent) {
    // quando un utente avvia per la prima volta il bot, il servizio salva id e username per migliorare l'esperienza utente (forse)
    const axios = require("axios")
    await axios({
      method: "GET",
      url: "https://json.extendsclass.com/bin/" + process.env.JSON_BIN_NUMBER,
    }).then(res => {
      var results = res.data
      var found = false
      for (var i = 0; i < results.length; i++) {
        if (results[i].id == agent.originalRequest.payload.data.from.id) {
          found = true
          break;
        }
      }
      if (!found) {
        var obj = {
          id: agent.originalRequest.payload.data.from.id,
          username: agent.originalRequest.payload.data.from.username
        }
        results.push(obj)
        axios({
          method: "PUT",
          url: "https://json.extendsclass.com/bin/" + process.env.JSON_BIN_NUMBER,
          data: results
        })
          .catch(err => {
            console.error(err)
          })
      }
    })
      .catch(err => {
        console.error(err)
      })
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text:
            "🤖 <i>" +
            JSON.parse(agent.request_.body.queryResult.fulfillmentText)
              .greeting +
            "</i> (" + JSON.parse(agent.request_.body.queryResult.fulfillmentText).movie + ")\n\n🎥 Do you want a movie suggestion from specific actors, director, genres, year, decade, language? You can also provide keywords to further narrow down the research. \n\n💬 For example: <i>" +
            JSON.parse(agent.request_.body.queryResult.fulfillmentText)
              .example +
            "</i>",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
  },
  movieRequestHandler: async function (agent) {
    return await movieController
      .getMovie(agent.context.get("movie_request-followup").parameters, 1)
      .then(async (res) => {
        if (res == undefined) {
          module.exports.errorMsg(agent, "Houston, we have a problem 😔")
        }
        else {
          var results = res.data.results
          if (res.data.total_pages > 1) {
            if (res.data.total_pages >= 3) {
              for (let n = 2; n < 4; n++) {
                await movieController
                  .getMovie(agent.context.get("movie_request-followup").parameters, n)
                  .then(async (res2) => {
                    Array.prototype.push.apply(results, res2.data.results)
                  })
                  .catch(err => { console.error(err) });
              }
            }
            else {
              await movieController
                .getMovie(agent.context.get("movie_request-followup").parameters, 2)
                .then(async (res2) => {
                  Array.prototype.push.apply(results, res2.data.results)
                })
                .catch(err => { console.error(err) });
            }
          }
          console.log(results.length)
          if (results.length !== 0) {
            let random = Math.floor(Math.random() * results.length);
            // estrae un film a caso
            var film = results[random];
            if (
              typeof agent.context.get("movie_request-followup").parameters
                .director !== "string"
            ) {
              film = await movieController.checkDirectors(
                results,
                agent.context.get("movie_request-followup").parameters.director
                  .name
              );
            }
            // cardGenres contiene i generi del film selezionato
            var cardGenres = "";
            if (film != undefined) {
              await movieController
                .getGenres()
                .then((response) => {
                  for (let x = 0; x < film.genre_ids.length; x++) {
                    for (let i = 0; i < response.data.genres.length; i++) {
                      if (film.genre_ids[x] === response.data.genres[i].id) {
                        // rimuove lo spazio ed aggiunge # al genere
                        cardGenres += "#" + response.data.genres[i].name.split('').filter(e => e.trim().length).join('') + " ";
                        break;
                      }
                    }
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
              let releaseDate = new Date(Date.parse(film.release_date));
              const card = new Card({
                title: "📽️ " + film.title,
                text:
                  (isNaN(releaseDate.getFullYear()) ? '' : ("\n📆 " + releaseDate.getFullYear())) +
                  (cardGenres == "" ? '' : ("\n🎬 " + cardGenres)) +
                  (isNaN(film.vote_average) ? '' : ("\n🌟 " + film.vote_average + "/10 ")) +
                  (film.overview == "" ? '' : ("\n📔 " + film.overview)),
                platform: "TELEGRAM",
              });
              if (film.poster_path != null) {
                card.setImage("https://image.tmdb.org/t/p/w200" + film.poster_path)
              }
              agent.add(card);
              agent.add(agent.request_.body.queryResult.fulfillmentText);
            }
            else {
              module.exports.errorMsg(agent, "Houston, we have a problem 😔")
            }
          } else {
            module.exports.errorMsg(agent, "No results found! Try another search 🙂")
          }
        }
      });
  },
  movieRequestRepeatNo: async function (agent) {
    agent.context.get("movie_request-followup");
  },
  movieRequestYes: function (agent) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text: "<i>" + JSON.parse(agent.request_.body.queryResult.fulfillmentText).msg + "</i> (" + JSON.parse(agent.request_.body.queryResult.fulfillmentText).movie + ")",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
    agent.context.delete("movie_request-followup");
  },
  movieRequestCustom: function (agent) {
    agent.add(agent.request_.body.queryResult.fulfillmentText);
  },

  helpHandler: function (agent) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text:
            "💬 With this bot you can receive a suggestion for a movie based on:\n\n 🎭 actors\n 🎥 director\n 📼 genres\n 📅 decade\n 🗓️ release year\n ⌚ runtime\n 🌐 language\n 🏷️ keywords\n\nFor example: <i>" +
            agent.request_.body.queryResult.fulfillmentText +
            "</i>",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
  },

  /*
  ########################################################################
  # Con agent.parameters.risorsa si può accedere al parametro (in teoria)
  #
  # IMPORTANTE: fare il return della promise altrimenti agent.add non va
  #
  ########################################################################

  altriHandler : function(agent){
    let year = agent.parameters.year;
    return movieController.getMovieByYear(year).then(res => {
      console.log(res.data.results)
      agent.add("lista film... " + res.data.results[0].original_title);
    });
  }
  */
};
