async function getConfig() {
    const response = await fetch('/config');
    return response.json();
}

async function redirectToRegistryI2CAT(){
    const config = await getConfig();
    window.location.href = config.registryUrlI2CAT;
}