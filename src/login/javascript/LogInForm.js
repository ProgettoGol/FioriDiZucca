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

        let self = this;

        function code201Callback(httpResponse) {
            self.code201Handler(httpResponse)
        }

        function code400Callback(httpResponse) {
            self.code400Handler(httpResponse)
        }

        function code401Callback(httpResponse) {
            self.code401Handler(httpResponse)
        }

        function code403Callback(httpResponse) {
            self.code403Handler(httpResponse)
        }

        function code404Callback(httpResponse) {
            self.code404Handler(httpResponse)
        }
        
        let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
        successfulResponses[1] = code201Callback;
        clientErrorResponses[0] = code400Callback;
        clientErrorResponses[1] = code401Callback;
        clientErrorResponses[3] = code403Callback;
        clientErrorResponses[4] = code404Callback;
        httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)    
    }

    init() {
        this.type = "login"

        this.usernameInput = new Input(document.getElementById("username"));
        this.passwordInput = new Input(document.getElementById("password"));

        super.init()
    }
}