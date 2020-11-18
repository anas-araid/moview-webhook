"use strict";
const movieController = require("../api/movieControllers.js");
const {
  WebhookClient,
  Payload,
  Card,
  Image,
} = require("dialogflow-fulfillment");
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
            "<i>" +
            JSON.parse(agent.request_.body.queryResult.fulfillmentText)
              .greeting +
            "</i>\nDo you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>" +
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
    return await movieController
      .getMovie(agent.context.get("movie_request-followup").parameters)
      .then(async (res) => {
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
          console.log(res.data.results);
          console.log(random);
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
            imageUrl: "https://image.tmdb.org/t/p/w200" + film.poster_path,
            platform: "TELEGRAM",
          });
          agent.add(card);
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
    if (agent.context.get("movie_request-followup") === null) {
      agent.add("fuori contesto repeat no!");
    }
    agent.context.get("movie_request-followup");
    // console.log(agent.context.get("movie_request-followup"));
    // agent.add("movie request non soddisfa l'utente! Altri film!!!!");
  },
  movieRequestYes: function (agent) {
    if (agent.context.get("movie_request-followup") === null) {
      agent.add("fuori contesto yes");
    }
    console.log(agent.request_.body.queryResult.fulfillmentText);
    agent.add(agent.request_.body.queryResult.fulfillmentText);
    agent.context.delete("movie_request-followup");
  },
  movieRequestCustom: function (agent) {
    if (agent.context.get("movie_request-followup") === null) {
      agent.add("fuori contesto custom!");
    }
    console.log(agent.context.get("movie_request-followup").parameters);
    agent.add("l'utente vuole altri filtri!");
  },

  helpHandler: function (agent) {
    agent.add(
      new Payload(
        agent.TELEGRAM,
        {
          text: "<i>Help intent activated!</i>\nFor example: <i>HELP HELP</i>",
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
