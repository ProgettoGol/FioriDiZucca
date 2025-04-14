// IMPLEMENT: Aggiungere un modo per aumentare i punti. Si potrebbe fare all'onclick del qr code

class PointSystem {
    init() {
        let sessionInfo = sessionHandler.sessionInfo;
        let username = sessionInfo.username;
        let points = Number(sessionInfo.punti);

        let mainCardUsername = document.querySelector("#user_info");
        let mainCardPoints = document.querySelector("#points");

        mainCardUsername.textContent = username;
        mainCardPoints.textContent = points + " punti";

        if(points >= 100) {
            let mask = document.querySelectorAll("#card_100 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 200) {
            let mask = document.querySelectorAll("#card_200 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 500) {
            let mask = document.querySelectorAll("#card_500 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 1000) {
            let mask = document.querySelectorAll("#card_1000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 2000) {
            let mask = document.querySelectorAll("#card_2000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 5000) {
            let mask = document.querySelectorAll("#card_5000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 10000) {
            let mask = document.querySelectorAll("#card_10000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 20000) {
            let mask = document.querySelectorAll("#card_20000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 50000) {
            let mask = document.querySelectorAll("#card_50000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
        
        if(points >= 100000) {
            let mask = document.querySelectorAll("#card_100000 .bloccato");
            for(const element of mask) {
                element.style.display = "none";
            }
        }
    }
}