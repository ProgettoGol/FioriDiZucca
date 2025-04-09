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
    document.getElementById("loginBtn")?.addEventListener("click", accediRegistrati);
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
});


    // parte di codice funzionante che va inserito nella registrazione        
// let nome = document.getElementById("nome")?.value || "Nome";
// let cognome = document.getElementById("cognome")?.value || "Cognome";
// let username = document.getElementById("username")?.value;
// let password = document.getElementById("password")?.value;

// const newUser = { nome, cognome, username, password };
// memoryHandler.saveCredenziali(newUser);
// alert("Utente registrato!");