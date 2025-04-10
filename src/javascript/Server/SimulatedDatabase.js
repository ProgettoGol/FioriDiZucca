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

        if(item === "sessions") {
            let newResource = {}
            for(const key of Object.keys(resource)) {
                let currentDate = new Date();
                let expirationDate = new Date(resource[key].expiration);
                if(!(currentDate >= expirationDate)) {
                    newResource[key] = resource[key];
                }
            }
            localStorage.setItem(item, JSON.stringify(newResource))
            resource = newResource;
        }

        if(resource[key] === undefined) return [];
        else return resource[key];
    }

    updateResource(type, item, key, body) {
        let resource = localStorage.getItem(item);

        if(resource === null) {
            // Se non esiste l'entry nel database, va creata
            // Il divieto di accesso a risorse che non devono esistere viene gestito a livello del server
            this.initResource(item)
            resource = localStorage.getItem(item);
        }

        resource = JSON.parse(resource);

        if(type === "JSONList") {
            if(resource[key] !== undefined) {
                resource[key].push(JSON.parse(body))
            } else {
                resource[key] = [];
                resource[key].push(JSON.parse(body))
            }
        } else if(type === "JSON") {
            resource[key] = JSON.parse(body)
        }

        localStorage.setItem(item, JSON.stringify(resource))
    }
}