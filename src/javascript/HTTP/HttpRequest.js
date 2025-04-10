class HttpRequest {
    constructor() {
        this.xmlHttpRequest = new XMLHttpRequest();
        this.server = new SimulatedServer();
    }

    databaseRequest(type, item, key, body) {
        try {
            return this.server.handleDatabaseRequest(type, item, key, body)
        } catch(response) {
            return response;
        }
    }

    // DEBUG: inserire 5 array per ogni set di risposte HTTP:
    // Informational responses (100 - 103)
    // Successful responses (200 - 226)
    // Redirection messages (300 - 308)
    // Client error responses (400 - 451)
    // Server error responses (500 - 511)
    handleResponse(httpResponse, ...callbacks) {
        switch(httpResponse.code) {
            case 200: {
                callbacks[0](httpResponse)
                break;
            }
            case 201: {
                callbacks[1](httpResponse)
                break;
            }
            case 400: {
                callbacks[2](httpResponse)
                break;    
            }
            case 401: {
                callbacks[4](httpResponse)
                break;
            }
            case 403: {
                callbacks[3](httpResponse)
                break;
            }
            case 404: {
                callbacks[5](httpResponse)
                break;
            }
            case 409: {
                callbacks[6](httpResponse)
                break;
            }
            default: {
                console.error("Unknown Error", httpResponse)
                break;
            }
        }
    }
}