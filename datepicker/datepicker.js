// DEBUG: Come implementare HTMLInputElement, che non supporta .attachShadow()?
// Estendere un elemento input sarebbe comodo, perché potrei utilizzare metodi come .setCustomValidity() e .reportValidity(), avrei accesso all'attributo value e sarei sempre ricollegato al form di appartenenza.
// Inoltre, potrei inviare il value del mio elemento insieme al resto del form nell'url come parte di una richiesta HTTP

customElements.define(
    "date-picker",
    class extends HTMLElement {
        constructor() {
            super()
            fetch("/datepicker/datepicker.html")
                .then(response => response.text())
                .then(html => {
                    // DEBUG: Questo è un "trick" per convertire testo in HTML. Ci deve essere una soluzione migliore
                    let templateDiv = document.createElement("div")
                    templateDiv.innerHTML = html;
                    let template = templateDiv.firstChild;

                    let templateContent = template.content;
                    const shadowRoot = this.attachShadow({mode: "open"});
                    shadowRoot.appendChild(templateContent.cloneNode(true))
                })
                .catch(error => console.error('Failed to load template:', error))
        }
    }
)