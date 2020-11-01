'use strict';

module.exports = {
  // con agent.parameters.risorsa si può accedere al parametro
  welcomeHandler : function(agent){
    agent.add("You talkin’ to me?");
    agent.add("Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: give me an action movie from the 80s with Stallone")
  },
  fallbackHandler : function(agent) {
    agent.add("I didn't understand");
    agent.add("I'm sorry, can you try again?");
  }
}
