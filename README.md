# moview

1. clonare il progetto **https://github.com/asdf1899/moview-webhook.git**
2. eseguire il comando **npm install**
3. per far partire il progetto eseguire **node src/index.js** oppure **npm run start**
###### Facoltativo
4. utilizzare ngrok per avere il server temporaneamente online (**ngrok http 8080**)
6. copiare l'url di ngrok (la versione https) in "webhook" nella sezione Fulfillment di Dialogflow
7. Per ogni intent in dialogflow attivare il toggle "Enable webhook call for this intent"

## struttura

- node_modules -----------------------(librerie) 
- src
  - api
    - handlers.js ------------------(funzioni con intent)
    - movieControllers.js ---------(funzioni che comunicano con tmdb)
  - bot
    - index.js ----------------------(bot telegram) -> NON SERVE PIU' (ma lo teniamo perchè non si sa mai)
  - server.js --------------------------- (server e webhook)
- .env ------------------------------------(variabili d'ambiente)
- .package.json --------------------------(configurazioni varie)


## to-do

- Funzioni che comunicano con tmdb (movieControllers.js)
- aggiungere altri intent in handlers.js
- capire come inviare il testo in italics, bold ecc.
- capire come inviare più immagini in una sola volta
- dentro handlers, per ogni intent aggiungere la lista delle risposte ed inviare una a caso (handlers.js) 