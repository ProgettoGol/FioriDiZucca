var todayString = new Date().toISOString().split('T')[0];

// Create dynamically?
var dateInput = document.getElementById("date");
dateInput.setAttribute('min', todayString);

var timeInput = document.getElementById("time");
var nameInput = document.getElementById("name");
var lastNameInput = document.getElementById("last_name");
var emailInput = document.getElementById("email");
var messageInput = document.getElementById("message");

var formDivs = document.getElementsByClassName("form-div-js");
for(const input of formDivs) {
    input.style.display = "none";
}

var result = document.getElementById("result");
result.style.display = "none";

var httpRequest = new HttpRequest();

// Creare un date picker customizzato.
// In questo modo, alla creazione del date picker, si possono disable le date non accettabili.
class DatePicker {
    isDateValid(date) {
        let dayOfTheWeek = new Date(date).getUTCDay()
        return (dayOfTheWeek === 0)
    }

    onDateSelection(date) {
        date = dateInput.value; //eliminare!

        result.style.display = "none";

        let times = document.querySelectorAll("option");
        for(const time of times) {
            if(time.disabled) time.disabled = false;
        }

        // Questa verifica si farà alla creazione del custom date picker
        if(this.isDateValid(date)) {
            dateInput.setCustomValidity('Siamo chiusi di domenica')
            dateInput.reportValidity()
            dateInput.value = "";
            return;
        } else {
            let httpResponse = httpRequest.databaseRequest("GET", "prenotazioni", date);
            switch(httpResponse.code) {
                case 200: {
                    let reservations = JSON.parse(httpResponse.body);

                    for(const reservation of reservations) {
                        let time = document.querySelector('option[value="' + reservation + '"]');
                        time.disabled = true;
                    }

                    // IMPLEMENT: orari inferiori all'orario corrente disabled

                    // DEBUG: ripete l'operazione inutilmente: quando sono già flex, il codice non deve essere eseguito
                    for(const input of formDivs) {
                        input.style.display = "flex";
                    }

                    break;
                }
                case 400: {
                    // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
                    // Il server effettua di nuovo la validazione dell'input e ritorna un errore
                    dateInput.setCustomValidity('Impossibile prenotare per la data selezionata')
                    dateInput.reportValidity()
                    dateInput.value = "";
                    break;
                }
                case 403: {
                    // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
                    console.error(httpResponse.code, httpResponse.message)
                    break;
                }
                case 404: {
                    // Non succede mai, perché la verifica di risorse Not Found viene effettuata, nel nostro caso, direttamente sul server
                    console.error(httpResponse.code, httpResponse.message)
                    break;
                }
                default: {
                    console.error("Unknown Error", httpResponse)
                    break;
                }
            }
        }
    }
}

class Prenotazione {
    constructor(orario, nome, cognome, email, message) {
        this.orario = orario;
        this.nome = nome + " " + cognome;
        this.email = email;
        this.message = message;
    }
}

class FormHandler {
    onFormSubmit(date) {
        if(dateInput.value === "") {
            dateInput.setCustomValidity('Selezionare una data')
            dateInput.reportValidity()
            return;
        }

        if(timeInput.value === "") {
            timeInput.setCustomValidity('Selezionare un orario')
            timeInput.reportValidity()
            return;
        }

        if(nameInput.value === "") {
            nameInput.setCustomValidity('Inserire un nome')
            nameInput.reportValidity()
            return;
        }

        if(lastNameInput.value === "") {
            lastNameInput.setCustomValidity('Inserire un cognome')
            lastNameInput.reportValidity()
            return;
        }

        if(emailInput.value === "") {
            emailInput.setCustomValidity("Inserire un'email")
            emailInput.reportValidity()
            return;
        }


        // IMPLEMENT: verificare il required degli input
        date = dateInput.value;

        let prenotazione = new Prenotazione(timeInput.value, nameInput.value, lastNameInput.value, emailInput.value, messageInput.value)
        prenotazione = JSON.stringify(prenotazione)

        let httpResponse = httpRequest.databaseRequest("PUT", "prenotazioni", date, prenotazione);
        switch(httpResponse.code) {
            case 201: {
                dateInput.value = "";
                timeInput.value = "";
                nameInput.value = "";
                lastNameInput.value = "";
                emailInput.value = "";
                messageInput.value = "";

                // Non strettamente necessario, ma sempre meglio resettare tutti gli input
                let times = document.querySelectorAll("option");
                for(const time of times) {
                    if(time.disabled) time.disabled = false;
                }

                for(const input of formDivs) {
                    input.style.display = "none";
                }

                let resultMessage = document.querySelector("#result p")
                resultMessage.textContent = "Prenotazione effettuata con successo";

                if(resultMessage.classList.contains("text-danger")) {
                    resultMessage.classList.remove("text-danger")
                }
                if(!resultMessage.classList.contains("text-success")) {
                    resultMessage.classList.add("text-success")
                }

                result.style.display = "flex";
                setTimeout(function() {result.style.display = "none"}, 3000)

                break;
            }
            case 400: {
                // Avviene solo nel caso in cui, dal lato client, sono state fatte modifiche al codice per cui è arrivato al server input non valido
                // Il server effettua di nuovo la validazione dell'input e ritorna un errore
                dateInput.value = "";
                timeInput.value = "";
                nameInput.value = "";
                lastNameInput.value = "";
                emailInput.value = "";
                messageInput.value = "";

                // Non strettamente necessario, ma sempre meglio resettare tutti gli input
                let times = document.querySelectorAll("option");
                for(const time of times) {
                    if(time.disabled) time.disabled = false;
                }

                for(const input of formDivs) {
                    input.style.display = "none";
                }

                let resultMessage = document.querySelector("#result p")

                if(resultMessage.classList.contains("text-success")) {
                    resultMessage.classList.remove("text-success")
                }
                if(!resultMessage.classList.contains("text-danger")) {
                    resultMessage.classList.add("text-danger")
                }

                resultMessage.textContent = "Errore durante la prenotazione. Riprovare";

                result.style.display = "flex";
                setTimeout(function() {result.style.display = "none"}, 3000)

                break;
            }
            case 403: {
                // Avviene solo nel caso in cui, dal lato client o con un attacco informatico, si cerca di accedere a risorse del database vietate
                console.error(httpResponse.code, httpResponse.message)
                break;
            }
            case 404: {
                // Non succede mai, perché la verifica di risorse Not Found viene effettuata, nel nostro caso, direttamente sul server
                console.error(httpResponse.code, httpResponse.message)
                break;
            }
            default: {
                console.error("Unknown Error", httpResponse)
                break;
            }
        }
    }
}

var datePicker = new DatePicker();
var formHandler = new FormHandler();

/*
// Codice lato SERVER

// DEBUG: aggiungere un controllo dell'esistenza dell'orario di prenotazione anche sul lato server
// Questo perché se una persona prenota nel frattempo, non si può modificare la pagina locale in tempo reale
// Tutti i controlli di validazione input vanno eseguiti anche sul lato server!

class MemoryHandler {
    getReservations(date) {
        let reservationList = localStorage.getItem('prenotazioni');
        reservationList = JSON.parse(reservationList);
        return reservationList[date];
    }

    updateReservations(date, time) {
        let reservationList = localStorage.getItem('prenotazioni');
        reservationList = JSON.parse(reservationList);
        if(reservationList[date] !== undefined) {
            reservationList[date].push(time)
        } else {
            reservationList[date] = [];
            reservationList[date].push(time)
        }
        localStorage.setItem('prenotazioni', JSON.stringify(reservationList))
    }
}

// Codice lato CLIENT
var date = document.querySelector("input[type=date]");
var today = new Date().toISOString().split('T')[0];
date.setAttribute('min', today);

var memoryHandler = new MemoryHandler();

var onDateSelection = function() {
    // DEBUG: new Date(date.value) genera anche un orario. getUTCDay() dovrebbe risolvere. Verificare che non dia problemi.
    let dayOfTheWeek = new Date(date.value).getUTCDay()
    if(dayOfTheWeek === 0) {
        // DEBUG: se si inserisce la data scrivendola, per certe date non aspetta che si finisca di inserirla prima di dare l'errore.
        // Si può risolvere, perché l'errore standard di data non disponibile (attributo min) funziona bene.
        // Esempio: 05/16/2025
        // DEBUG: Se una data è selezionata, si clicca la freccia per cambiare mese e lo stesso giorno il mese successivo è domenica, anche se non si seleziona quel giorno, appare il messaggio di errore
        date.setCustomValidity('Siamo chiusi di domenica')
        date.reportValidity()
        date.value = "";
    } else {
        // inviare richiesta al server per orari disponibili
        // il database del nostro server è, per ora, localstorage
        let times = document.querySelectorAll("option");
        for(const time of times) {
            if(time.disabled) time.disabled = false;
        }

        let reservations = memoryHandler.getReservations(date.value)
        if(reservations !== undefined) {
            for(const reservation of reservations) {
                let time = document.querySelector('option[value="' + reservation + '"]');
                time.disabled = true;
            }
        }
    }
}

var time = document.querySelector("select");

var onFormSubmit = function() {
    memoryHandler.updateReservations(date.value, time.value)
}
*/