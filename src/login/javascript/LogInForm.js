class LogInForm extends CredentialsForm {

    code400Handler(httpResponse) {
        this.resetForm()
        this.showMessage("Errore durante il login. Riprovare", false, 3000, "result_log_in")
    }

    code401Handler(httpResponse) {
        this.resetForm(this.passwordInput)
        this.showMessage("Password errata. Riprovare", false, 3000, "result_log_in")
    }

    code404Handler(httpResponse) {
        // IMPLEMENTARE: inserire i dati del login (tranne la password) nel form di registrazione
        this.resetForm()
        this.showMessage("Utente non registrato", false, 1000, "result_log_in")
            .then(signUpForm.show)
    }

    onFormSubmit() {
        let httpResponse = super.onFormSubmit([], 'Username non valido', 'Password non valida')
        if(!(httpResponse instanceof HttpResponse) && !httpResponse) return;
        
        let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
        successfulResponses[1] = super.code201Handler.bind(this);
        clientErrorResponses[0] = this.code400Handler.bind(this);
        clientErrorResponses[1] = this.code401Handler.bind(this);
        clientErrorResponses[3] = super.code403Handler.bind(this);
        clientErrorResponses[4] = this.code404Handler.bind(this);
        httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)    
    }

    init() {
        this.type = "login"

        this.usernameInput = new Input(document.getElementById("username"));
        this.passwordInput = new Input(document.getElementById("password"));

        super.init()
    }
}