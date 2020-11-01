# moview

1. clonare il progetto **https://github.com/asdf1899/moview-webhook.git**
2. eseguire il comando **npm install**
3. nella root del progetto creare un file .env con dentro BOT_TOKEN=token_che_vi_mando_su_telegram
4. per far partire il progetto eseguire **node src/index.js** oppure **npm run start**


## struttura

- node_modules --------(librerie) 
- src
  - api
    - api.js ---------(api che comunica con the movie db)
  - index.js -----------(bot telegram)
- .env --------------------(contiene il token del bot)
- .package.json ----------(configurazioni varie)