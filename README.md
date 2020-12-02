<div align="center">
  <h1>moview</h1>
  <p>An open source movie recommendation bot for Telegram.</p>
  <img src="https://anasaraid.me/hosting/moview/moview_logo.png" alt="logo" align="center" width="170px" />
</div>

#### tech stack

  - [ExpressJS](https://vuejs.org/)
  - [Dialogflow library](https://github.com/dialogflow/dialogflow-fulfillment-nodejs)
  - [TMDB api](https://developers.themoviedb.org/3/getting-started/introduction)

####

With [moview](https://t.me/moview_chatbot) you can ask for a movie of a certain:
- actor
- director
- genre
- year
- language
etc.

For example: *"give me a comedy movie from 2010"*


### Getting Started

1. scaricare o clonare il progetto **https://github.com/asdf1899/moview-webhook.git**
2. nella root del progetto creare un file .env
3. dentro il file .env aggiungere l'api key di tmdb (in questo modo **TMDB_KEY=api_key_di_tmdb**), la porta di rete (**PORT=8080**) e **JSON_BIN_NUMBER=api_key_di_extendsclass**
4. eseguire il comando **npm install**
5. creare un branch col tuo nome es. *moview_mario*
6. per far partire il progetto eseguire **node src/index.js** oppure **npm run start**
7. una volta completate le modifiche seguire le istruzioni in [*contribution*](https://github.com/asdf1899/moview-webhook/tree/main#contribution)
###### Se nessuno sta lavorando al bot puoi testarlo in questo modo:
6. scaricare ngrok
6. rendi il server temporaneamente online (**ngrok http 8080**)
7. copiare l'url di ngrok (la versione https) in "webhook" nella sezione Fulfillment di Dialogflow

### Structure

- node_modules -----------------------(librerie) 
- src
  - api
    - handlers.js ------------------(funzioni con intent)
    - movieControllers.js ---------(funzioni che comunicano con tmdb)
  - bot
    - index.js ----------------------(bot telegram) -> NON SERVE PIU' (ma lo teniamo perchè non si sa mai)
  - server.js ---------------------------(server e webhook)
- .env ------------------------------------(variabili d'ambiente)
- .package.json --------------------------(configurazioni varie)

### Contribution
Premessa: non lavorare direttamente nel branch main, ma nel tuo branch *moview_nome*

1. Prima di fare una [pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request), dal tuo branch (moview_nome), scaricare l'ultima versione del progetto usando il comando "**git pull origin main**"
2. se non ci sono problemi, dal tuo branch eseguire il comando **git push origin moview_nome** (sostituire moview_nome col tuo nome)
    - ATTENZIONE: non fare git push se sei nel branch main
    - Controlla sempre di essere nel tuo branch (moview_nome)
    - Se è la prima volta che fai push dal tuo branch ti chiederà di aggiungere il branch a remote usando il comando *git push --set-upstream origin moview_nome*
3. dalla repo su Github, aprire la scheda *pull requests* oppure direttamente da [qua](https://github.com/asdf1899/moview-webhook/pulls)
4. cliccare il pulsante verde "New pull request"
5. selezionare il tuo branch (moview...) e il branch base (**development**) com in figura
<img src="https://anasaraid.me/hosting/moview/pull.png"/>
6. aggiungere nel commento le modifiche effettuate ed infine cliccare sul pulsante "create pull request"

<br>

### Deployment

Per pubblicare il progetto su heroku è consigliato utilizzare un branch a parte (per es. production), dove il codice è 'pulito' e non ci sono console.log() o altro codice che potrebbe 'sporcare' la console.

Se si è stati aggiunti come contributor in heroku, per pubblicare una nuova versione del progetto:
- spostarsi su un branch production
- fare il merge delle modifiche
- sistemare il codice (togliere i console.log() ecc.)
- da terminale eseguire il comando *heroku login* (verrai reindirizzato sul tuo browser per fare il login)
- poi *heroku git:remote -a moviewbot*
- ed infine *git push heroku production:main* (utilizzare branch:main se si vuole pushare da un branch diverso da main in locale a main su heroku)
I log del server si possono consulare o sulla dashboard di heroku sul sito, oppure direttamente dal terminale, utilizzando il comando *heroku logs --tail*


<br>

Visto che non c'è documentazione per dialogflow fullfillment (nodejs), conviene cercarsi le robe che servono direttamente all'interno della [libreria](https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/src) su Github



<br>


### Authors

- [Anas Araid](https://www.github.com/asdf1899)
- [Valentino Frasnelli](https://www.github.com/valefras)
- [Lorenzo Bocchi](https://www.github.com/bocchilorenzo)
- [Erich Robbi](https://www.github.com/erich-r)
- [Nicola Pasqualini](https://www.github.com/kkwego)
