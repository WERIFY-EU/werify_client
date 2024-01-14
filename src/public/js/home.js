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