class SimulatedDatabase {
    initResource(item) {
        localStorage.setItem(item, JSON.stringify({}))
    }

    getResource(item, key) {
        let resource = localStorage.getItem(item);

        if(resource === null) {
            // Se non esiste l'entry nel database, va creata
            // Il divieto di accesso a risorse che non devono esistere viene gestito a livello del server
            this.initResource(item)
            resource = localStorage.getItem(item);
        }

        resource = JSON.parse(resource);

        if(resource[key] === undefined) return [];
        else return resource[key];
    }

    updateResource(item, key, body) {
        let resource = localStorage.getItem(item);

        if(resource === null) {
            // Se non esiste l'entry nel database, va creata
            // Il divieto di accesso a risorse che non devono esistere viene gestito a livello del server
            this.initResource(item)
            resource = localStorage.getItem(item);
        }

        resource = JSON.parse(resource);
        if(resource[key] !== undefined) {
            resource[key].push(JSON.parse(body))
        } else {
            resource[key] = [];
            resource[key].push(JSON.parse(body))
        }

        localStorage.setItem('prenotazioni', JSON.stringify(resource))
    }
}