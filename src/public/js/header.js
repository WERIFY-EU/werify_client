async function getConfig() {
    const response = await fetch('/config');
    return response.json();
}

async function redirectToLogin() {
    const config = await getConfig();
    window.location.href = config.loginUrl;
}

async function redirectToRegistry() {
    const config = await getConfig();
    window.location.href = config.registryUrl;
}

async function redirectToShowCertificate() {
    const config = await getConfig();
    window.open(config.certificateUrl, '_blank');
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));  // Establece la cookie para que expire en un año
    document.cookie = `i18next=${language}; expires=${date.toUTCString()}; path=/`;
    window.location.reload();  // Recarga la página para aplicar el cambio de idioma
}
