# moview

1. clonare il progetto **https://github.com/asdf1899/moview-webhook.git**
2. eseguire il comando **npm install**
3. per far partire il progetto eseguire **node src/index.js** oppure **npm run start**
###### Facoltativo
4. utilizzare ngrok per avere il server temporaneamente online
6. copiare l'url di ngrok in "webhook" nella sezione Fulfillment di Dialogflow
7. Per ogni intent in dialogflow attivare il toggle "Enable webhook call for this intent"

## struttura

- node_modules -----------------------(librerie) 
- src
  - api
    - handlers.js ------------------(funzioni con intent)
    - movieControllers.js ---------(funzioni che comunicano con tmdb)
  - bot
    - index.js ----------------------(bot telegram) -> non serve più
  - server.js
- .env ------------------------------------(variabili d'ambiente)
- .package.json --------------------------(configurazioni varie)