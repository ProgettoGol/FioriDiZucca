class SimulatedServer {
    constructor() {
        this.database = new SimulatedDatabase();
    }

    handleDatabaseRequest(item, key) {
        if(item === "prenotazioni") {
            let resource;
            try {
                resource = this.database.getResource(item);
            } catch(response) {
                if(response.code === 404) {
                    this.database.updateResource("")
                    resource = {};
                } else {
                    throw response
                }
            } finally {
                // Le prenotazioni si possono effettuare fino alle 02:00 per il giorno corrente, altrimenti dal giorno successivo
                let date = new Date(key);
                let today = new Date();
                if((date < today) || (date.getUTCDay() === 0)) {
                    throw new HttpResponse(400, "Bad Request")
                }

                let reservations = resource[key];
                if(reservations === undefined) return new HttpResponse(200, "OK", JSON.stringify([]));
                else return new HttpResponse(200, "OK", JSON.stringify(reservations));
            }
        } else {
            throw new HttpResponse(403, "Forbidden")
        }
    }
}