class MemoryHandler {
    saveCredenziali(CredenzialiJSON) {
        // bisogna fare il check su null. Se non esiste, crearlo
        let listaCredenzialiString = window.localStorage.getItem('listaCredenziali');
        let listaCredenzialiJSON = JSON.parse(listaCredenzialiString);
        listaCredenzialiJSON.push(CredenzialiJSON)
        window.localStorage.setItem("listaCredenziali", JSON.stringify(listaCredenzialiJSON))
    }

    getCredenziali() {
        // Il confronto andrebbe fatto sul server, quindi non bisognerebbe ritornare l'intera lista ma solo le credenziali JSON singole
        // bisogna fare il check su null
        return JSON.parse(window.localStorage.getItem("listaCredenziali"))
    }
}

class Website {
    constructor() {
        this.memoryHandler = new MemoryHandler();
    }

    sessionRequest() {
        // recupera i cookie
        // verifica che ci sia una sessione attiva
        // Se c'è una sessione attiva sostituisce il bottone login con un bottone logout
        // Se c'è una sessione attiva crea dinamicamente la pagina areapersonale
        // Se non c'è una sessione attiva, lascia invariato
    }

    HTTPRequest() {
        let username = document.getElementById("username");
        let password = document.getElementById("password");
        let passwordHashed = password.value; //sha256(password.value)
        let datiUtente = {
            "username": username,
            "password": passwordHashed
        }

        // bisogna fare il check su null
        let listaCredenziali = this.memoryHandler.getCredenziali();
        for(const credenzialiJSON of listaCredenziali.listaCredenziali) {
            if((datiUtente.username === credenzialiJSON.username) && (datiUtente.password === credenzialiJSON.password)) {
                // Ritorna response status 200 OK
            } else {
                // Ritorna response status 400 Bad Request
            }
        }
    }

    accediRegistrati() {
        let statusCode = this.HTTPRequest();
        if(statusCode === '400') { //Come si fa?
            // reindirizza a registrazione
            // recupera i dati input per la registrazione dal form registrazione
            // fa il salvataggio in localStorage (this.memoryHandler.saveCredenziali(credenzialiJSON))
        } else {
            // effettua login
            // salva la sessione corrente nel cookie (come si fa?)

            // cos'è la sessione? 
            // L'username dell'utente (da scrivere in ogni pagina html in alto a destra di fianco al tasto Logout)
            // numero di punti della pagina personale

            // crea dinamicamente l'area personale (in base al numero di punti sblocca le card necessarie)
        }
    }

    logout() {
        // cancella i cookie
        // blocca l'accesso all'area personale
    }
}

var website = new Website();

window.onload = function() {
    let doesCookieExist = website.sessionRequest()
};