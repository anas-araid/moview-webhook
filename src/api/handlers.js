'use strict';

module.exports = {
  welcomeHandler : function(agent){
    return agent.add("You talkin’ to me?");
  },
  fallbackHandler : function(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
}
