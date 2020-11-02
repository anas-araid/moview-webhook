'use strict';
const movieController = require('../api/movieControllers.js');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Payload} = require('dialogflow-fulfillment');

module.exports = {
  welcomeHandler : function(agent){
    agent.add("You talkin’ to me?");
    agent.add("Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: give me an action movie from the 80s with Stallone")
  },
  fallbackHandler : function(agent) {
    agent.add("I didn't understand");
    agent.add("I'm sorry, can you try again?");
  },
  startHandler : function(agent) {
    agent.add(new Payload(agent.TELEGRAM, {"text": "<i>You talkin’ to me?</i>\nDo you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>give me an action movie from the 80s with Stallone</i>", "parse_mode": "html"}, {sendAsMessage: true}))
    // Finchè non sistemano la libreria non si possono mandare due payload contemporaneamente
    //agent.add(new Payload(agent.TELEGRAM, {"text": "Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>give me an action movie from the 80s with Stallone</i>", "parse_mode": "html"}, {sendAsMessage: true}));
  }
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

}
