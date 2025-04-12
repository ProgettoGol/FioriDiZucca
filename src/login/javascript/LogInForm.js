class LogInForm {
    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    showMessage(message, success, milliseconds) {
        let resultMessage = document.querySelector("#result_log_in p")
        let resultDiv = document.getElementById("result_log_in");

        resultMessage.textContent = message;
        if(success) resultMessage.classList.add("text-success")
        else resultMessage.classList.add("text-danger")

        resultDiv.classList.remove("d-none")
        resultDiv.classList.add("d-flex")

        return new Promise( (resolve) => {
            setTimeout(function() {
                resultDiv.classList.remove("d-flex")
                resultDiv.classList.add("d-none")
                if(success) resultMessage.classList.remove("text-success")
                else resultMessage.classList.remove("text-danger")
                resolve()
            }, milliseconds)
        })
    }

    resetForm(...ids) {
        let usernameInput = document.getElementById("username");
        let passwordInput = document.getElementById("password");

        let deleteAll = ids.length === 0;
        
        if(ids.includes(usernameInput.id) || deleteAll) {
            usernameInput.value = "";
        }

        if(ids.includes(passwordInput.id) || deleteAll) {
            passwordInput.value = "";
        }
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
        this.showMessage("Errore durante il login. Riprovare", false, 3000)
        this.resetForm()
    }

    code401Handler(httpResponse) {
        this.showMessage("Password errata. Riprovare", false, 3000)
        this.resetForm("password")
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code404Handler(httpResponse) {
        // IMPLEMENTARE: inserire i dati del login (tranne la password) nel form di registrazione
        this.resetForm()
        this.showMessage("Utente non registrato", false, 1000)
            .then(signUpForm.show)
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

    init() {
        
    }
}