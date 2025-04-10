class Credentials {
    constructor(name, lastName, password, type) {
        this.name = name;
        this.lastName = lastName;
        this.password = password;
        this.type = type;
    }
}

class LogInForm {
    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    #isUsernameNotValid(username) {
        return username.trim() === "";
    }

    #isPasswordNotValid(password) {
        return password.trim() === "";
    }

    code201Handler(httpResponse) {
        console.log("Login avvenuto con successo")
        let tokenJSON = JSON.parse(httpResponse.body)
        let token = tokenJSON.token;
        let expirationDate = new Date(tokenJSON.expiration)
        document.cookie = `sessionToken=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
        location.replace("/src/html/areapersonale.html")
        // HANDLING DELLA SESSIONE:
        // recupero della Sessione
        // Trasformazione del pulsante login
        // Cambio degli href per l'area personale
        // Creazione dell'area personale, con i punti
    }

    code400Handler(httpResponse) {
        console.log("Errore durante il login. Riprovare")
    }

    code401Handler(httpResponse) {
        console.log("Password errata. Riprovare")
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code404Handler(httpResponse) {
        // XMLHTTPREQUEST -> popup della pagina di registrazione
        // Per ora:
        location.replace("/src/html/registrati.html")
    }

    onFormSubmit() {
        // DEBUG: Impossibile fare il submit del form dopo il reportValidity()
        // Potrebbe essere utile inserire setCustomValidity("") da qualche parte

        let usernameInput = document.getElementById("username");
        let username = usernameInput.value;
        if(this.#isUsernameNotValid(username)) {
            this.showCustomValidity(usernameInput, 'Username non valido')
            return;
        }


        let passwordInput = document.getElementById("password");
        let password = passwordInput.value;
        if(this.#isPasswordNotValid(password)) {
            console.log(password)
            this.showCustomValidity(passwordInput, 'Password non valida')
            return;
        }

        let credentials = new Credentials("", "", password, "login")

        let httpResponse = httpRequest.databaseRequest("POST", "credenziali", username, JSON.stringify(credentials))
        httpRequest.handleResponse(httpResponse, null, this.code201Handler.bind(this), this.code400Handler.bind(this), this.code403Handler.bind(this), this.code401Handler.bind(this), this.code404Handler.bind(this), null)
    }
}

class SignUpForm {
    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    #isUsernameNotValid(username) {
        return username.trim() === "";
    }

    #isNameNotValid(name) {
        return name.trim() === "";
    }

    #isLastNameNotValid(lastName) {
        return lastName.trim() === "";
    }

    #isPasswordNotValid(password) {
        return password.trim() === "";
    }

    code201Handler(httpResponse) {
        console.log("Registrazione avvenuta con successo")
        // HANDLING DELLA SESSIONE:
        // Salvataggio dei cookie
        // Trasformazione del pulsante login
        // Cambio degli href per l'area personale
        // Creazione dell'area personale, con i punti
    }

    code400Handler(httpResponse) {
        console.log("Errore durante la registrazione. Riprovare")
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code409Handler(httpResponse) {
        console.log("Username esistente")
    }

    onFormSubmit() {
        let usernameInput = document.getElementById("sign_up_username");
        let username = usernameInput.value;
        if(this.#isUsernameNotValid(username)) {
            this.showCustomValidity(usernameInput, 'Username non valido')
            return;
        }        

        let nameInput = document.getElementById("sign_up_name");
        let name = nameInput.value;
        if(this.#isNameNotValid(name)) {
            this.showCustomValidity(nameInput, 'Nome non valido')
            return;
        }


        let lastNameInput = document.getElementById("sign_up_last_name");
        let lastName = lastNameInput.value;
        if(this.#isLastNameNotValid(lastName)) {
            this.showCustomValidity(lastNameInput, 'Nome non valido')
            return;
        }


        let passwordInput = document.getElementById("sign_up_password");
        let password = passwordInput.value;
        if(this.#isPasswordNotValid(password)) {
            console.log(password)
            this.showCustomValidity(passwordInput, 'Password non valida')
            return;
        }

        let credentials = new Credentials(name, lastName, password, "signup")

        let httpResponse = httpRequest.databaseRequest("POST", "credenziali", username, JSON.stringify(credentials))
        httpRequest.handleResponse(httpResponse, null, this.code201Handler.bind(this), this.code400Handler.bind(this), this.code403Handler.bind(this), null, null, this.code409Handler.bind(this))
    }
}

class SessionHandler {
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

    code200Handler() {
        // SESSION HANDLING
        // Trasformazione del pulsante login
        // Cambio degli href per l'area personale
        // Creazione dell'area personale, con i punti
    }

    code404Handler() {
        // Avviene solo nel caso di attacchi informatici o modifica del javascript
    }

    retrieveSession() {
        let token = this.getCookie("sessionToken");
        if(token !== "") {
            let httpResponse = httpRequest.databaseRequest("GET", "sessions", token)
            console.log(httpResponse)
        }
    }

    destroySession() {
        let token = this.getCookie("sessionToken");
        if(token !== "") {
            document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            let httpResponse = httpRequest.databaseRequest("DELETE", "sessions", token)
            console.log(httpResponse)
        }
    }
}

/*
document.addEventListener('DOMContentLoaded', function () {
    console.log("Event loaded");


    const memoryHandler = {
        saveCredenziali: function (credenzialiJSON) {
            localStorage.setItem("listaCredenziali", JSON.stringify(credenzialiJSON));
        },

        getCredenziali: function () {
            let data = localStorage.getItem("listaCredenziali");
            return data ? JSON.parse(data) : [];
        }
    };

    function HTTPRequest() {
        let username = document.getElementById("username")?.value;
        let password = document.getElementById("password")?.value;

        if (username != null && username.trim() != "" || password != null && password.trim() != "") {
            const listaCredenziali = memoryHandler.getCredenziali();
            for (const user of listaCredenziali) {
                if (user.username === username && user.password === password) {
                    console.log("200 OK");
                    return '200';
                }
            }
        }else  {          
            console.log("400 Bad Request");
            return '400';
        }
        console.log("404 User not found");
        return '404';
    }

    function accediRegistrati() {
        console.log("Pre-login");
        const response = HTTPRequest();

        if (response === '400') {
            alert("Inserisci username e password.");
        } else if (response === '404') {
            alert("Utente non salvato")
        } else {
            // Login e gestione sessione
            document.cookie = `session=${document.getElementById("username").value}; path=/;`;
            console.log("Login effettuato. Sessione salvata nei cookie.");
        }
    }

    function logout() {
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("Logout effettuato. Cookie cancellato.");
    }

    const newUser = [{
        nome: "Mario",
        cognome: "Rossi",
        username: "mariorossi",
        password: "12345"
      },{
        nome: "Luca",
        cognome: "Tommasi",
        username: "l.tommasi",
        password: "12345"
      }
    ]
      memoryHandler.saveCredenziali(newUser);

    // Esempio: puoi associare queste funzioni a bottoni nel tuo HTML
    // document.getElementById("loginBtn")?.addEventListener("click", accediRegistrati);
    // document.getElementById("logoutBtn")?.addEventListener("click", logout);
});


    // parte di codice funzionante che va inserito nella registrazione        
// let nome = document.getElementById("nome")?.value || "Nome";
// let cognome = document.getElementById("cognome")?.value || "Cognome";
// let username = document.getElementById("username")?.value;
// let password = document.getElementById("password")?.value;

// const newUser = { nome, cognome, username, password };
// memoryHandler.saveCredenziali(newUser);
// alert("Utente registrato!");
*/