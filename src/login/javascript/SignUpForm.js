class SignUpForm extends Form {
    show() {
        let modal = new bootstrap.Modal(document.getElementById("sign_up_modal"))
        modal.show()
    }

    code201Handler(httpResponse) {
        let tokenJSON = JSON.parse(httpResponse.body)
        console.log(tokenJSON)
        let token = tokenJSON.token;
        let expirationDate = new Date(tokenJSON.expiration)
        document.cookie = `sessionToken=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
        location.replace("/src/areapersonale/html/areapersonale.html")        
    }

    code400Handler(httpResponse) {
        this.showMessage("Errore durante la registrazione. Riprovare", false, 3000, "result_sign_up")
        this.resetForm()
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code409Handler(httpResponse) {
        this.showMessage("Username già in uso. Riprovare", false, 3000, "result_sign_up")
        this.resetForm(this.usernameInput)
    }

    onFormSubmit() {
        if(this.nameInput.isInputNotValid()) {
            this.showCustomValidity(this.nameInput, 'Nome non valido')
            return;
        }

        if(this.lastNameInput.isInputNotValid()) {
            this.showCustomValidity(this.lastNameInput, 'Cognome non valido')
            return;
        }

        if(this.usernameInput.isInputNotValid()) {
            this.showCustomValidity(this.usernameInput, 'Username non valido')
            return;
        }

        if(this.passwordInput.isInputNotValid()) {
            this.showCustomValidity(this.passwordInput, 'Password non valida')
            return;
        }

        let credentials = new Credentials(this.nameInput.inputElement.value, this.lastNameInput.inputElement.value, this.passwordInput.inputElement.value, "signup")

        let httpResponse = httpRequest.databaseRequest("POST", "credenziali", this.usernameInput.inputElement.value, JSON.stringify(credentials))
        httpRequest.handleResponse(httpResponse, null, this.code201Handler.bind(this), this.code400Handler.bind(this), this.code403Handler.bind(this), null, null, this.code409Handler.bind(this))
    }

    init() {
        this.usernameInput = new Input(document.getElementById("sign_up_username"));
        this.nameInput = new Input(document.getElementById("sign_up_name"));
        this.lastNameInput = new Input(document.getElementById("sign_up_last_name"));
        this.passwordInput = new Input(document.getElementById("sign_up_password"));

        let self = this;

        function showCustomValidityCallback(input, message) {
            self.showCustomValidity(input, message)
        }

        super.init()
        this.usernameInput.showCustomValidityCallback = showCustomValidityCallback;
        this.nameInput.showCustomValidityCallback = showCustomValidityCallback;
        this.lastNameInput.showCustomValidityCallback = showCustomValidityCallback;
        this.passwordInput.showCustomValidityCallback = showCustomValidityCallback;
    }
}