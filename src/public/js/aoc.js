async function getConfig() {
    const response = await fetch('/config');
    return response.json();
}

async function redirectToRegistryAOC() {
    const config = await getConfig();
    window.location.href = config.registryUrlAOC;
}