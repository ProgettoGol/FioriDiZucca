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
            case 403: {
                callbacks[3](httpResponse)
                break;
            }
            default: {
                console.error("Unknown Error", httpResponse)
                break;
            }
        }
    }
}