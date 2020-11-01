'use strict';

module.exports = {
  welcomeHandler : function(agent){
    console.log('welcome')
    agent.add("You talkin’ to me?");
    agent.add("Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: give me an action movie from the 80s with stallone");
  },
  fallbackHandler : function(agent) {
    console.log("fallback")
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
}
