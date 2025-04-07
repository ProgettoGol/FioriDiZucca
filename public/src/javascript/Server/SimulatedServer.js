class SimulatedServer {
    constructor() {
        this.database = new SimulatedDatabase();
    }

    #isDateNotValid(date) {
        let reservationDate = new Date(date);
        let today = new Date();
        // Le prenotazioni si possono effettuare fino alle 02:00 per il giorno corrente, altrimenti dal giorno successivo
        return ((reservationDate < today) || (reservationDate.getUTCDay() === 0));
    }

    #areFormInputsNotValid(newReservation, date, item) {
        // verifica che nessuno degli input sia vuoto
        let areInputsEmpty = ((date === "") || (newReservation.orario === "") || (newReservation.nome.startsWith(" ")) || (newReservation.nome.endsWith(" ")) || (newReservation.email === ""))
        let doesReservationAlreadyExist = false;

        // Non c'è bisogno di fare altri controlli sulla data, perché questi vengono già effettuati insieme alla GET request
        let reservationTimes;
        try {
            reservationTimes = this.handleDatabaseRequest('GET', item, date);
        } catch(response) {
            // vuol dire che l'errore non andava gestito a questo livello, ma a quello superiore
            throw response
        }
        reservationTimes = JSON.parse(reservationTimes.body);

        for(const reservationTime of reservationTimes) {
            if(newReservation.orario === reservationTime) {
                // Avviene nel caso in cui venga abilitata e selezionata una option che era stata disabilitata sul lato client, o in caso di attacchi informatici
                doesReservationAlreadyExist = true;
                break;
            }
        }

        return (areInputsEmpty || doesReservationAlreadyExist);
    }

    handleDatabaseRequest(type, item, key, body) {
        if(type === 'GET') { //Simula una richiesta "GET item/key"

            if(item === "prenotazioni") {
                // Input validation
                if(this.#isDateNotValid(key)) {
                    throw new HttpResponse(400, "Bad Request")
                }

                // GET request handling
                let reservations;
                try {
                    reservations = this.database.getResource(item, key);
                } catch(response) {
                    // vuol dire che l'errore non andava gestito a questo livello, ma a quello superiore
                    throw response
                } finally {
                    // Se la risorsa esiste, la ritorno, altrimenti ritorno una lista vuota
                    let reservationTimes = [];
                    for(const reservation of reservations) {
                        if(reservation.orario !== undefined) {
                            reservationTimes.push(reservation.orario)
                        }
                    }
                    return new HttpResponse(200, "OK", JSON.stringify(reservationTimes));
                }
            } else {
                // Il client ha cercato di accedere a risorse a cui non ha accesso
                throw new HttpResponse(403, "Forbidden")
            }

        } else if(type === 'PUT') { //Simula una richiesta "PUT item/key body"

            if(item === 'prenotazioni') {
                // input validation
                if(this.#areFormInputsNotValid(JSON.parse(body), key, item)) {
                    throw new HttpResponse(400, "Bad Request")
                }

                // IMPLEMENT: orari inferiori all'orario corrente non validi

                // PUT request handling
                try {
                    this.database.updateResource(item, key, body)
                } catch(response) {
                    // vuol dire che l'errore non andava gestito a questo livello, ma a quello superiore
                    throw response
                } finally {
                    return new HttpResponse(201, "Created")
                }
            } else {
                // Il client ha cercato di accedere a risorse a cui non ha accesso
                throw new HttpResponse(403, "Forbidden")
            }

        }

    }
}