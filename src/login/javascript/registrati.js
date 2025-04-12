// DEBUG: sono unite sia la logica di login che la logica della registrazione; bisognerebbe separarle

const SESSION_KEY = 'userLoggedIn';
const container = document.getElementById('authButtonContainer');

// Gestione bottone login/logout
function renderButtons() {
  if (localStorage.getItem(SESSION_KEY) === 'true') {
    container.innerHTML = `
      <button id="logoutBtn" class="btn btn-danger">Logout</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    container.innerHTML = `
      <button id="loginBtn" class="btn btn-success">Login</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', login);
  }
}

function login() {
  localStorage.setItem(SESSION_KEY, 'true');
  renderButtons();
  alert('Login effettuato!');
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  renderButtons();
  alert('Logout effettuato!');
}

renderButtons();

// Validazione form + login automatico
document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email');
  const emailConferma = document.getElementById('emailConferma');
  const password = document.getElementById('password');
  const passwordConferma = document.getElementById('passwordConferma');

  let valid = true;

  [email, emailConferma, password, passwordConferma].forEach(el => {
    el.classList.remove('is-invalid');
  });

  if (email.value !== emailConferma.value) {
    emailConferma.classList.add('is-invalid');
    valid = false;
  }

  if (password.value !== passwordConferma.value) {
    passwordConferma.classList.add('is-invalid');
    valid = false;
  }

  if (valid) {
    // Simula accesso
    localStorage.setItem(SESSION_KEY, 'true');
    renderButtons();

    // Chiude il modale
    const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
    modal.hide();

    alert('Registrazione completata. Sei ora loggato!');
  }
});