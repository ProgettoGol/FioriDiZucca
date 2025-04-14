// DEBUG: validazione timeInput -> orari superiori agli orari di chiusura (compreso il sabato) non validi
// DEBUG: validazione timeInput -> orari non ogni 15 minuti non validi
// DEBUG: validazione dateInput -> non possono essere selezionate date non realmente esistenti (esempio: 29-02-2019)

class ReservationForm extends Form {
    resetForm(flag) {
        if(!flag) {
            super.resetForm()
        } else {
            super.resetForm(this.timeInput)
        }
        this.timeInput.disableTimes()
    }

    code201Handler(httpResponse) {
        this.resetForm(false)
        this.showMessage("Prenotazione effettuata con successo", true, 3000, "result_reservation")
    }

    code400Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        this.resetForm(false)
        this.showMessage("Errore durante la prenotazione. Riprovare", false, 3000, "result_reservation")
    }

    onFormSubmit() {
        let isValid = super.onFormSubmit([], 'Impossibile prenotare per la data selezionata', "Impossibile prenotare per l'orario selezionato", 'Nome non valido', 'Cognome non valido', 'Email non valida')
        if(!isValid) return;

        let prenotazione = new Prenotazione(this.timeInput.inputElement.value, this.nameInput.inputElement.value, this.lastNameInput.inputElement.value, this.emailInput.inputElement.value, this.messageInput.inputElement.value)
        prenotazione = JSON.stringify(prenotazione)

        let httpResponse = httpRequest.databaseRequest("PUT", "prenotazioni", this.dateInput.inputElement.value, prenotazione);

        let self = this;

        function code201Callback(httpResponse) {
            self.code201Handler(httpResponse)
        }

        function code400Callback(httpResponse) {
            self.code400Handler(httpResponse)
        }

        function code403Callback(httpResponse) {
            self.code403Handler(httpResponse)
        }

        let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
        successfulResponses[1] = code201Callback;
        clientErrorResponses[0] = code400Callback;
        clientErrorResponses[3] = code403Callback;
        httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)
    }

    init() {
        this.dateInput = new DateInput(document.getElementById("date"));
        this.timeInput = new TimeInput(document.getElementById("time"));
        this.nameInput = new Input(document.getElementById("name"));
        this.lastNameInput = new Input(document.getElementById("last_name"));
        this.emailInput = new Input(document.getElementById("email"));
        this.messageInput = new Input(document.getElementById("message"));

        let self = this;

        function resetFormCallback(flag) {
            self.resetForm(flag)
        }

        function enableTimesCallback(reservations) {
            self.timeInput.enableTimes(reservations)
        }

        function showCustomValidityCallback(input, message) {
            self.showCustomValidity(input, message)
        }

        this.resetForm(false)
        this.dateInput.enableTimesCallback = enableTimesCallback;
        this.dateInput.resetFormCallback = resetFormCallback;
        this.dateInput.showCustomValidityCallback = showCustomValidityCallback;
        this.timeInput.showCustomValidityCallback = showCustomValidityCallback;
        this.nameInput.showCustomValidityCallback = showCustomValidityCallback;
        this.lastNameInput.showCustomValidityCallback = showCustomValidityCallback;
        this.emailInput.showCustomValidityCallback = showCustomValidityCallback;
    }
}