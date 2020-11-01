'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const handlers = require('../src/api/handler.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function WebhookProcessing(req, res) {
  const agent = new WebhookClient({request: req, response: res});
  console.log("asdf");
  console.log('----------------------')
  const action = agent.action;
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', handlers.welcomeHandler);
  intentMap.set('Default Fallback Intent', handlers.fallbackHandler);
  agent.handleRequest(intentMap);
}

// Webhook
app.post('/', function (req, res) {
  console.info("asdf");
  WebhookProcessing(req, res);
});

app.listen(8080, function () {
  console.info("listening on port 8080")
});