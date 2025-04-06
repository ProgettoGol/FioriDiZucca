var todayString = new Date().toISOString().split('T')[0];

// Create dynamically?
var dateInput = document.querySelector("input[type=date]");
dateInput.setAttribute('min', todayString);

var formjs = document.getElementsByClassName("form-js");
for(const input of formjs) {
    input.style.display = "none";
}

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
        // Questa verifica si farà alla creazione del custom date picker
        if(this.isDateValid(date)) {
            dateInput.setCustomValidity('Siamo chiusi di domenica')
            dateInput.reportValidity()
            dateInput.value = "";
            return;
        } else {
            let httpResponse = httpRequest.getFromDatabase("prenotazioni", date);
            switch(httpResponse.code) {
                case 200: {
                    let reservations = JSON.parse(httpResponse.body);

                    for(const reservation of reservations) {
                        let time = document.querySelector('option[value="' + reservation + '"]');
                        time.disabled = true;
                    }

                    // orari inferiori all'orario corrente disabled

                    // DEBUG: ripete l'operazione inutilmente: quando sono già flex, il codice non deve essere eseguito
                    for(const input of formjs) {
                        input.style.display = "flex";
                    }

                    break;
                }
                case 400: {
                    dateInput.setCustomValidity('Impossibile prenotare per la data selezionata')
                    dateInput.reportValidity()
                    dateInput.value = "";
                    break;
                }
                case 403: {
                    console.error(httpResponse.code, httpResponse.message)
                    break;
                }
                case 404: {
                    console.error(httpResponse.code, httpResponse.message)
                    break;
                }
                default: {
                    console.error("Unknown Error", httpResponse.message)
                    break;
                }
            }
        }
    }
}

class Prenotazione {

}

class FormHandler {
    
}

var datePicker = new DatePicker();

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