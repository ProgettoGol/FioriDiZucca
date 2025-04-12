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