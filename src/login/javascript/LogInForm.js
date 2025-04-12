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
        let tokenJSON = JSON.parse(httpResponse.body)
        let token = tokenJSON.token;
        let expirationDate = new Date(tokenJSON.expiration)
        document.cookie = `sessionToken=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
        location.replace("/src/areapersonale/html/areapersonale.html")
        // HANDLING DELLA SESSIONE:
        // Cambio degli href per l'area personale
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
        // Show error message, then wait a second and show modal
        console.log("Utente non registrato")
        let modal = new bootstrap.Modal(document.getElementById("sign_up_modal"))
        modal.toggle()
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