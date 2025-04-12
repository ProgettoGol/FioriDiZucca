class SignUpForm {
    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    showMessage(message, success, milliseconds) {
        let resultMessage = document.querySelector("#result_sign_up p")
        let resultDiv = document.getElementById("result_sign_up");

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

    show() {
        let modal = new bootstrap.Modal(document.getElementById("sign_up_modal"))
        modal.show()
    }

    resetForm(...ids) {
        let usernameInput = document.getElementById("sign_up_username");
        let nameInput = document.getElementById("sign_up_name");
        let lastNameInput = document.getElementById("sign_up_last_name");
        let passwordInput = document.getElementById("sign_up_password");

        let deleteAll = ids.length === 0;
        
        if(ids.includes(usernameInput.id) || deleteAll) {
            usernameInput.value = "";
        }

        if(ids.includes(nameInput.id) || deleteAll) {
            nameInput.value = "";
        }

        if(ids.includes(lastNameInput.id) || deleteAll) {
            lastNameInput.value = "";
        }

        if(ids.includes(passwordInput.id) || deleteAll) {
            passwordInput.value = "";
        }
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
        let tokenJSON = JSON.parse(httpResponse.body)
        console.log(tokenJSON)
        let token = tokenJSON.token;
        let expirationDate = new Date(tokenJSON.expiration)
        document.cookie = `sessionToken=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
        location.replace("/src/areapersonale/html/areapersonale.html")
        // HANDLING DELLA SESSIONE:
        // Cambio degli href per l'area personale
        
    }

    code400Handler(httpResponse) {
        this.showMessage("Errore durante la registrazione. Riprovare", 3000)
        this.resetForm()
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code409Handler(httpResponse) {
        this.showMessage("Username già in uso. Riprovare", 3000)
        this.resetForm("sign_up_username")
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

    init() {
    }
}