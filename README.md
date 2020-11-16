# moview

1. scaricare o clonare il progetto **https://github.com/asdf1899/moview-webhook.git**
2. nella root del progetto creare un file .env
3. dentro il file .env aggiungere l'api key di tmdb (in questo modo **TMDB_KEY=api_key_di_tmdb**) e la porta di rete (**PORT=8080**)
4. eseguire il comando **npm install**
5. creare un branch col tuo nome es. *moview_mario*
6. per far partire il progetto eseguire **node src/index.js** oppure **npm run start**
7. una volta completate le modifiche seguire le istruzioni in [*contribution*](https://github.com/asdf1899/moview-webhook/tree/main#contribution)
###### Se nessuno sta lavorando al bot puoi testarlo in questo modo:
6. scaricare ngrok
6. rendi il server temporaneamente online (**ngrok http 8080**)
7. copiare l'url di ngrok (la versione https) in "webhook" nella sezione Fulfillment di Dialogflow

## structure

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

## contribution
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

## to-do

- capire come inviare più immagini in una sola volta
- dentro handlers, per ogni intent aggiungere la lista delle risposte (citazioni) ed inviare una a caso (handlers.js)
- controllare che l'immagine ricevuta dall'api di tmdb non sia *null*
- aggiungere la durata del film nella response

Visto che no c'è documentazione per dialogflow fullfillment (nodejs), conviene cercarsi le robe che servono direttamente all'interno della [libreria](https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/src) su Github



<br>

Se ci sono problemi scrivetemi su [telegram](https://t.me/asdf1899).