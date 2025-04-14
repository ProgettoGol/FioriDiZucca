// IMPLEMENT: Creare un date picker customizzato.
// In questo modo, alla creazione del date picker, si possono disable le date non valide.
class DateInput extends Input {
    constructor(inputElement) {
        super(inputElement)
        this.enableTimesCallback;
        this.resetFormCallback;
    }

    isInputNotValid() {
        let reservationDate = new Date(this.inputElement.value);
        let today = new Date();
        // Oltre alle verifiche standard valide per tutti gli elementi input
        // Le prenotazioni si possono effettuare fino alle 02:00 per il giorno corrente, altrimenti dal giorno successivo
        // Le prenotazioni non si possono effettuare di domenica
        return (super.isInputNotValid() || (reservationDate < today) || (reservationDate.getUTCDay() === 0));
    }

    code200Handler(httpResponse) {
        let reservations = JSON.parse(httpResponse.body);
        this.enableTimesCallback(reservations)
    }

    code400Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        // Il client non fa nulla, perché gli orari saranno già tutti disattivati
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    onInput() {
        this.resetFormCallback(true)
        super.onInput()
    }

    onBlur() {
        if(this.changed) {
            let httpResponse = httpRequest.databaseRequest("GET", "prenotazioni", this.inputElement.value);

            let self = this;

            function code200Callback(httpResponse) {
                self.code200Handler(httpResponse)
            }

            function code400Callback(httpResponse) {
                self.code400Handler(httpResponse)
            }

            function code403Callback(httpResponse) {
                self.code403Handler(httpResponse)
            }

            let informationalResponses = [], successfulResponses = [], redirectionMessages = [], clientErrorResponses = [], serverErrorResponses = [];
            successfulResponses[0] = code200Callback;
            clientErrorResponses[0] = code400Callback;
            clientErrorResponses[3] = code403Callback;
            httpRequest.handleResponse(httpResponse, informationalResponses, successfulResponses, redirectionMessages, clientErrorResponses, serverErrorResponses)

            this.changed = false;
        }
    }
}