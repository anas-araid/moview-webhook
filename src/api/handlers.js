"use strict";
const movieController = require("../api/movieControllers.js");
const {
  WebhookClient,
  Payload,
  Card,
  Image,
} = require("dialogflow-fulfillment");

module.exports = {
  welcomeHandler: function (agent) {
    agent.add("You talkin’ to me?");
    agent.add(
      "Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: give me an action movie from the 80s with Stallone"
    );
  },
  fallbackHandler: function (agent) {
    agent.add(agent.request_.body.queryResult.fulfillmentText);
    // agent.add("I didn't understand");
    // agent.add("I'm sorry, can you try again?");
  },
  startHandler: function (agent) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text:
            "🤖 <i>" +
            JSON.parse(agent.request_.body.queryResult.fulfillmentText)
              .greeting +
            "</i>\n\n🎥 Do you want a movie suggestion from specific actors, directors, genres, year, decade, language? You can also provide keywords to further narrow down the research. \n\n💬 For example: <i>" +
            JSON.parse(agent.request_.body.queryResult.fulfillmentText)
              .example +
            "</i>",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
    // Finchè google non sistema la libreria non si possono mandare due payload contemporaneamente
    //agent.add(new Payload(agent.TELEGRAM, {"text": "Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>give me an action movie from the 80s with Stallone</i>", "parse_mode": "html"}, {sendAsMessage: true}));
  },
  movieRequestHandler: async function (agent) {
    console.log(movieController.GENRES);
    return await movieController
      .getMovie(agent.context.get("movie_request-followup").parameters)
      .then(async (res) => {
        console.log(res.data.total_pages);

        //var results = [];
        //var len = 1;
        //var defaultLifespan = 10;
        // var start =
        //   defaultLifespan -
        //   agent.context.get("movie_request-followup").lifespan;

        // if (
        //   agent.context.get("movie_request-followup").lifespan ===
        //   defaultLifespan
        // ) {
        //   len = res.data.results.length > 5 ? 5 : res.data.results.length;
        // } else {
        //   len = start + len;
        // }
        console.log("PARAMETERS:");
        console.log(agent.context.get("movie_request-followup").parameters);
        // console.log("ENDING INDEX:");
        // console.log(len);

        if (res.data.results.length !== 0) {
          let random = Math.floor(Math.random() * res.data.results.length);
          var film = res.data.results[random];
          if (
            typeof agent.context.get("movie_request-followup").parameters
              .director !== "string"
          ) {
            film = await movieController.checkDirectors(
              res,
              agent.context.get("movie_request-followup").parameters.director
                .name
            );
          }
          console.log(film);
          // cardGenres contiene i generi del film selezionato
          // let cardGenres = "";
          // for (let j = 0; j < film.genre_ids.length; j++) {
          //   movieController.GENRES.forEach((genre) => {
          //     if (genre.id === film.genre_ids[j]) {
          //       cardGenres += genre.name + "|";
          //     }
          //   });
          // }
          // rimuovo l'ultimo |
          var cardGenres = "";
          await movieController
            .getGenres()
            .then((response) => {
              for (let x = 0; x < film.genre_ids.length; x++) {
                for (let i = 0; i < response.data.genres.length; i++) {
                  if (film.genre_ids[x] === response.data.genres[i].id) {
                    var bar = x == film.genre_ids.length - 1 ? "" : "|";
                    cardGenres += response.data.genres[i].name + bar;
                    break;
                  }
                }
              }
            })
            .catch((err) => {
              console.error(err);
            });
          //cardGenres = cardGenres.slice(0, -1);
          let releaseDate = new Date(Date.parse(film.release_date));
          const card = new Card({
            title: "📽️ " + film.title,
            text:
              "\n📆 " +
              releaseDate.getFullYear() +
              "\n🎬 " +
              cardGenres +
              "\n🌟 " +
              film.vote_average +
              "/10 " +
              "\n📔 " +
              film.overview,
            imageUrl: "https://image.tmdb.org/t/p/w200" + film.poster_path,
            platform: "TELEGRAM",
          });
          agent.add(card);
          agent.add(agent.request_.body.queryResult.fulfillmentText);

          // for (let i = 0; i < results.length; i++) {
          //   // const anotherImage = new Image({
          //   //   imageUrl:
          //   //     "https://image.tmdb.org/t/p/w100" + results[i].poster_path,
          //   //   platform: "TELEGRAM",
          //   // });
          //   // agent.add(anotherImage);
          //   agent.add(results[i].title);
          // }
        } else {
          // bisognerebbe far partire qualche fallback (con frasi a caso)
          agent.add(
            new Payload(
              agent.TELEGRAM,
              {
                text: "<i>Houston, we have a problem.</i>",
                parse_mode: "html",
              },
              { sendAsMessage: true }
            )
          );
          agent.add("Try again😔");
        }
      });
  },

  movieRequestRepeatNo: async function (agent) {
    agent.context.get("movie_request-followup");
    // console.log(agent.context.get("movie_request-followup"));
    // agent.add("movie request non soddisfa l'utente! Altri film!!!!");
  },
  movieRequestYes: function (agent) {
    console.log(agent.request_.body.queryResult.fulfillmentText);
    agent.add(agent.request_.body.queryResult.fulfillmentText);
    agent.context.delete("movie_request-followup");
  },
  movieRequestCustom: function (agent) {
    console.log(agent.context.get("movie_request-followup").parameters);
    agent.add(agent.request_.body.queryResult.fulfillmentText);
  },

  helpHandler: function (agent) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text:
            "💬 With this bot you can receive a suggestion for a movie based on:\n\n 🎭 actors\n 🎥 directors\n 📼 genre\n 📅 decade\n 🗓️ release year\n ⌚ runtime\n 🌐 language\n 🏷️ keywords\n\nFor example: <i>" +
            agent.request_.body.queryResult.fulfillmentText +
            "</i>",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
  },
  // movieRandomHandler: function (agent) {
  //   return movieController.getRandomMovie().then((res) => {
  //     let result = res.data.results;
  //     if (result.length !== 0) {
  //       // genera un random tra 0 e la lunghezza dell'array
  //       let randomIndex = Math.floor(Math.random() * result.length + 0);
  //       // selectedMovie contiene il film selezionato
  //       let selectedMovie = result[randomIndex];
  //       let releaseDate = new Date(Date.parse(selectedMovie.release_date));
  //       const card = new Card({
  //         title: "📽️ " + selectedMovie.title,
  //         text:
  //           "\n🌟 " +
  //           selectedMovie.vote_average +
  //           "/10 \n📆 " +
  //           releaseDate.getFullYear() +
  //           " \n📔 " +
  //           selectedMovie.overview,
  //         imageUrl:
  //           "https://image.tmdb.org/t/p/w200" + selectedMovie.poster_path,
  //         platform: "TELEGRAM",
  //       });
  //       agent.add(card);
  //     } else {
  //       // bisognerebbe far partire qualche fallback (con frasi a caso)
  //       agent.add(
  //         new Payload(
  //           agent.TELEGRAM,
  //           { text: "<i>Huston, we have a problem.</i>", parse_mode: "html" },
  //           { sendAsMessage: true }
  //         )
  //       );
  //       agent.add("Try again😔");
  //     }
  //   });
  // },

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
