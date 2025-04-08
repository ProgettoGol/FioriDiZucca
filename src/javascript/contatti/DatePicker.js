// DEBUG: definire gli attributi da qualche altra parte, non nel costruttore

// IMPLEMENT: Creare un date picker customizzato.
// In questo modo, alla creazione del date picker, si possono disable le date non valide.
class DatePicker {
    constructor(disableTimesCallback, resetFormCallback, showFormCallback) {
        this.dateInput = document.getElementById("date");
        this.disableTimesCallback = disableTimesCallback;
        this.resetFormCallback = resetFormCallback;
        this.showFormCallback = showFormCallback;
    }

    init() {
        let todayString = new Date().toISOString().split('T')[0];
        this.dateInput.setAttribute('min', todayString);
    }

    #isDateNotValid(date) {
        // DEBUG: se si inserisce la data scrivendola, per certe date non aspetta che si finisca di inserirla prima di dare l'errore.
        // Si può risolvere, perché l'errore standard di data non disponibile (attributo min) funziona bene.
        // Esempio: 05/16/2025
        // DEBUG: Se una data è selezionata, si clicca la freccia per cambiare mese e lo stesso giorno il mese successivo è domenica, anche se non si seleziona quel giorno, appare il messaggio di errore
        let dayOfTheWeek = new Date(date).getUTCDay()
        return (dayOfTheWeek === 0)
    }

    showCustomValidity(input, message) {
        input.setCustomValidity(message)
        input.reportValidity()
    }

    code200Handler(httpResponse) {
        let reservations = JSON.parse(httpResponse.body);
        this.disableTimesCallback(reservations)
        this.showFormCallback()
    }

    code400Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
        // Il server effettua di nuovo la validazione dell'input e ritorna un errore
        this.showCustomValidity(this.dateInput, 'Impossibile prenotare per la data selezionata')
        this.dateInput.value = "";
    }

    code403Handler(httpResponse) {
        // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
        console.error(httpResponse.code, httpResponse.message)
    }

    onDateSelection() {
        this.resetFormCallback(true)
        let date = this.dateInput.value;

        // IMPLEMENT: Questa verifica si farà alla creazione del custom date picker (disabilitando le date non valide)
        if(this.#isDateNotValid(date)) {
            this.showCustomValidity(this.dateInput, 'Impossibile prenotare per la data selezionata')
            // this.dateInput.value = "";
            return;
        }

        let httpResponse = httpRequest.databaseRequest("GET", "prenotazioni", date);
        httpRequest.handleResponse(httpResponse, this.code200Handler.bind(this), null, this.code400Handler.bind(this), this.code403Handler.bind(this))
    }
}