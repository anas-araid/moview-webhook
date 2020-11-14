"use strict";
const movieController = require("../api/movieControllers.js");
const { WebhookClient, Payload, Card } = require("dialogflow-fulfillment");
//const { ContextValues } = require("actions-on-google/dist/service/dialogflow");

module.exports = {
  welcomeHandler: function (agent) {
    agent.add("You talkin’ to me?");
    agent.add(
      "Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: give me an action movie from the 80s with Stallone"
    );
  },
  fallbackHandler: function (agent) {
    agent.add("I didn't understand");
    agent.add("I'm sorry, can you try again?");
  },
  startHandler: function (agent) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text:
            "<i>You talkin’ to me?</i>\nDo you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>give me an action movie from the 80s with Stallone</i>",
          parse_mode: "html",
        },
        { sendAsMessage: true }
      )
    );
    // Finchè google non sistema la libreria non si possono mandare due payload contemporaneamente
    //agent.add(new Payload(agent.TELEGRAM, {"text": "Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>give me an action movie from the 80s with Stallone</i>", "parse_mode": "html"}, {sendAsMessage: true}));
  },
  movieRequestHandler: function (agent) {
    return movieController.getMovie(agent.parameters).then((res) => {
      console.log(
        "#####################################################################################à"
      );

      var results = [];
      var len = res.data.results.length > 5 ? 5 : res.data.results.length;

      if (agent.parameters.director === "") {
        for (let i = 0; i < len; i++) {
          results.push(res.data.results[i]);
        }
      } else {
        results = movieController.checkDirectors(res, agent);
      }
      console.log(results);

      if (results.length !== 0) {
        let film = results[0];
        let releaseDate = new Date(Date.parse(film.release_date));
        const card = new Card({
          title: "📽️ " + film.title,
          text:
            "\n🌟 " +
            film.vote_average +
            "/10 \n📆 " +
            releaseDate.getFullYear() +
            " \n📔 " +
            film.overview,
          imageUrl: "https://image.tmdb.org/t/p/w400" + film.poster_path,
          platform: "TELEGRAM",
        });
        agent.add(card);
      } else {
        // bisognerebbe far partire qualche fallback (con frasi a caso)
        agent.add(
          new Payload(
            agent.TELEGRAM,
            { text: "<i>Houston, we have a problem.</i>", parse_mode: "html" },
            { sendAsMessage: true }
          )
        );
        agent.add("Try again😔");
      }
    });
  },

  movieRequestRepeatNo: function (agent) {
    if (agent.context.get("movie_request-followup") === null) {
      agent.add("fuori contesto repeat no!");
    }
    console.log(agent.context.get("movie_request-followup").parameters);
    agent.add("movie request non soddisfa l'utente! Altri film!!!!");
  },
  movieRequestYes: function (agent) {
    if (agent.context.get("movie_request-followup") === null) {
      agent.add("fuori contesto yes");
    }
    console.log(agent.context.get("movie_request-followup").parameters);
    agent.add("movie request soddisfa l'utente!");
  },
  movieRequestCustom: function (agent) {
    if (agent.context.get("movie_request-followup") === null) {
      agent.add("fuori contesto custom!");
    }
    console.log(agent.context.get("movie_request-followup").parameters);
    agent.add("l'utente vuole altri filtri!");
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
