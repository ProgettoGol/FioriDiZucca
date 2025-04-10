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

    #areReservationFormInputsNotValid(newReservation, date, item) {
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

    #areLoginFormInputsNotValid(newCredentials, key) {
        let isUsernameNotValid = ((key === null) || (key.trim() === ""));
        let isPasswordNotValid = (newCredentials.password === null || newCredentials.password.trim() === "");
        return isUsernameNotValid || isPasswordNotValid;
    }

    #areSignupFormInputsNotValid(newCredentials, key) {
        let isNameNotValid = ((newCredentials.name === null) || (newCredentials.name.trim() === ""));
        let islastNameNotValid = ((newCredentials.lastName === null) || (newCredentials.lastName.trim() === ""));
        return this.#areLoginFormInputsNotValid(newCredentials, key) || isNameNotValid || islastNameNotValid;

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
                if(this.#areReservationFormInputsNotValid(JSON.parse(body), key, item)) {
                    throw new HttpResponse(400, "Bad Request")
                }

                // PUT request handling
                try {
                    this.database.updateResource("JSONList", item, key, body)
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

        } else if(type === 'POST') {
            
            if(item === 'credenziali') {

                if(JSON.parse(body).type === "login") {
                    if(this.#areLoginFormInputsNotValid(JSON.parse(body), key)) {
                        throw new HttpResponse(400, "Bad Request")
                    }

                    let credentials;
                    try {
                        credentials = this.database.getResource(item, key)
                    } catch(response) {
                        // vuol dire che l'errore non andava gestito a questo livello, ma a quello superiore
                        throw response
                    } finally {
                        if(Array.isArray(credentials)) {
                            throw new HttpResponse(404, "Not Found")
                        }

                        let newCredentials = JSON.parse(body)
                        if(credentials.password === newCredentials.password) {
                            // CREA SESSIONE
                            throw new HttpResponse(201, "Created")
                        } else {
                            throw new HttpResponse(401, "Unauthorized")
                        }
                    }
                } else if(JSON.parse(body).type === "signup") {
                    if(this.#areSignupFormInputsNotValid(JSON.parse(body), key)) {
                        throw new HttpResponse(400, "Bad Request")
                    }

                    let credentials;
                    try {
                        credentials = this.database.getResource(item, key)
                    } catch(response) {
                        // vuol dire che l'errore non andava gestito a questo livello, ma a quello superiore
                        throw response
                    } finally {
                        if(!Array.isArray(credentials)) {
                            throw new HttpResponse(409, "Conflict")
                        }

                        try {
                            this.database.updateResource("JSON", item, key, body)
                        } catch(response) {
                            // vuol dire che l'errore non andava gestito a questo livello, ma a quello superiore
                            throw response
                        } finally {
                            // CREA SESSIONE
                            throw new HttpResponse(201, "Created")
                        }
                    }
                }
            } else {
                throw new HttpResponse(403, "Forbidden")
            }
        }

    }
}