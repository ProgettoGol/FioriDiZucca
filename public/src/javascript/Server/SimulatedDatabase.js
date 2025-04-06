class SimulatedDatabase {
    getResource(item) {
        let resource = localStorage.getItem(item)
        if(resource === null) {
            throw new HttpResponse(404, "Not Found")
        }
        return JSON.parse(resource);
    }

    updateResource() {

    }
}