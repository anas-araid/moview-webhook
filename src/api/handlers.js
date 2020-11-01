'use strict';

module.exports = {
  welcomeHandler : function(agent){
    console.log('welcome')
    return agent.add("You talkin’ to me?");
  },
  fallbackHandler : function(agent) {
    console.log("fallback")
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
}
