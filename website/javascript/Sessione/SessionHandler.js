class SessionHandler {
    constructor() {
        this.isSessionActive = false;
        this.sessionInfo = {};
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
        this.sessionInfo = JSON.parse(httpResponse.body);
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

            let self = this;

            function code200Callback(httpResponse) {
                self.code200Handler(httpResponse)
            }

            function code403Callback(httpResponse) {
                self.code403Handler(httpResponse)
            }

            function code404Callback(httpResponse) {
                self.code404Handler(httpResponse)
            }

            let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
            successfulResponses[0] = code200Callback;
            clientErrorResponses[3] = code403Callback;
            clientErrorResponses[4] = code404Callback;
            httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)
        }
    }

    destroySession() {
        let token = this.getCookie("sessionToken");
        if(token !== "") {
            document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            let httpResponse = httpRequest.databaseRequest("DELETE", "sessions", token)

            let self = this;

            function code204Callback(httpResponse) {
                self.code204Handler(httpResponse)
            }

            function code403Callback(httpResponse) {
                self.code403Handler(httpResponse)
            }

            let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
            successfulResponses[4] = code204Callback;
            clientErrorResponses[3] = code403Callback;
            httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)

            if(window.location.pathname === "/src/areapersonale/html/areapersonale.html") {
                window.location = "/"
            } else {
                // Necessario, perché il bottone di login e logout vengono caricati al load della pagina
                window.location.reload()
            }
        }
    }
}