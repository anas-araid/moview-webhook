"use strict";
// importo dialogflow
const { WebhookClient } = require("dialogflow-fulfillment");
// importo express e altre cose
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
// importo il modulo handlers con dentro le funzioni per gli intent
const handlers = require("../src/api/handlers.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const intentMap = new Map();
intentMap.set("Default Fallback Intent", handlers.fallbackHandler);
intentMap.set("start", handlers.startHandler);
intentMap.set("movie_request", handlers.movieRequestHandler);
intentMap.set("movie_request - repeat_no", handlers.movieRequestHandler);
intentMap.set("movie_request - custom", handlers.movieRequestCustom);
intentMap.set("movie_request - yes", handlers.movieRequestYes);
intentMap.set("help", handlers.helpHandler);

function Webhook(req, res) {
  // se il platform non è specificato, evita il crash del webhook
  if (!req.body.queryResult.fulfillmentMessages) return;
  req.body.queryResult.fulfillmentMessages = req.body.queryResult.fulfillmentMessages.map(
    (m) => {
      if (!m.platform) m.platform = "PLATFORM_UNSPECIFIED";
      return m;
    }
  );
  const agent = new WebhookClient({ request: req, response: res });
  // agent.originalRequest.payload.data = dati dell'utente telegram
  agent.handleRequest(intentMap);
}

// root del server
app.post("/", function (req, res) {
  // passo la richiesta alla funzione webhook
  Webhook(req, res);
});
// server in ascolto sulla porta 8080
app.listen(process.env.PORT, function () {
  console.log("listening on port " + process.env.PORT);
});
