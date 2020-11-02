'use strict';
const movieController = require('../api/movieControllers.js');

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
    //console.log(agent)
    //console.log(agent.consoleMessages[0].payload)
    //console.log("--------------------------------------------------")
    //console.log(agent.originalRequest.payload.data)
    //agent.add(agent.consoleMessages[0].payload.telegram);
    agent.add("You talkin’ to me?");
    agent.add("Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: give me an action movie from the 80s with Stallone")
    agent.add("DIO CANE FUNZIONA");
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
