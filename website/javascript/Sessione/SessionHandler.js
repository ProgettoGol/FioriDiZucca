class SessionHandler {
    constructor() {
        this.isSessionActive = false;
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }

    code200Handler(httpResponse) {
        this.isSessionActive = true;
        return JSON.parse(httpResponse.body);
        // SESSION HANDLING
        // Trasformazione del pulsante login
        // Cambio degli href per l'area personale
        // Creazione dell'area personale, con i punti
    }

    code204Handler(httpResponse) {
        this.isSessionActive = false;
        // RESET pagine allo stato iniziale (pre-login)
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code404Handler(httpResponse) {
        // Avviene solo nel caso di attacchi informatici o modifica del javascript
    }

    retrieveSession() {
        let token = this.getCookie("sessionToken");
        if(token !== "") {
            let httpResponse = httpRequest.databaseRequest("GET", "sessions", token)
            return httpRequest.handleResponse(httpResponse, this.code200Handler.bind(this), null, null, this.code403Handler.bind(this), null, this.code404Handler.bind(this), null, null)
        }
    }

    destroySession() {
        let token = this.getCookie("sessionToken");
        if(token !== "") {
            document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            let httpResponse = httpRequest.databaseRequest("DELETE", "sessions", token)
            httpRequest.handleResponse(httpResponse, null, null, null, this.code403Handler.bind(this), null, null, this.code204Handler.bind(this))
        }
    }
}