class LogInForm extends Form {
    code201Handler(httpResponse) {
        let tokenJSON = JSON.parse(httpResponse.body)
        let token = tokenJSON.token;
        let expirationDate = new Date(tokenJSON.expiration)
        document.cookie = `sessionToken=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
        location.replace("/src/areapersonale/html/areapersonale.html")
    }

    code400Handler(httpResponse) {
        this.showMessage("Errore durante il login. Riprovare", false, 3000, "result_log_in")
        this.resetForm()
    }

    code401Handler(httpResponse) {
        this.showMessage("Password errata. Riprovare", false, 3000, "result_log_in")
        this.resetForm(this.passwordInput)
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    code404Handler(httpResponse) {
        // IMPLEMENTARE: inserire i dati del login (tranne la password) nel form di registrazione
        this.resetForm()
        this.showMessage("Utente non registrato", false, 1000, "result_log_in")
            .then(signUpForm.show)
    }

    onFormSubmit() {
        if(this.usernameInput.isInputNotValid()) {
            this.showCustomValidity(this.usernameInput, 'Username non valido')
            return;
        }

        if(this.passwordInput.isInputNotValid()) {
            this.showCustomValidity(this.passwordInput, 'Password non valida')
            return;
        }

        let credentials = new Credentials("", "", this.passwordInput.inputElement.value, "login")

        let httpResponse = httpRequest.databaseRequest("POST", "credenziali", this.usernameInput.inputElement.value, JSON.stringify(credentials))
        httpRequest.handleResponse(httpResponse, null, this.code201Handler.bind(this), this.code400Handler.bind(this), this.code403Handler.bind(this), this.code401Handler.bind(this), this.code404Handler.bind(this), null)
    }

    init() {
        this.usernameInput = new Input(document.getElementById("username"));
        this.passwordInput = new Input(document.getElementById("password"));

        let self = this;

        function showCustomValidityCallback(input, message) {
            self.showCustomValidity(input, message)
        }

        super.init()
        this.usernameInput.showCustomValidityCallback = showCustomValidityCallback;
        this.passwordInput.showCustomValidityCallback = showCustomValidityCallback;
    }
}