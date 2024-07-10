
document.getElementById("showQrButton").onclick = function () {
    var modal = document.getElementById("qrModal");
    var span = document.getElementsByClassName("close")[0];

    // Close modal when user clicks on <span> (x)
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when user clicks outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Setup the fetch request options for a POST request
    fetch('/client/generate-token')
    .then(response => response.json())
    .then(data => {
        const generatedToken = data.token;

        // Setup the fetch request options for a POST request
        fetch(`${IssuerBaseUrl}/generate_qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generatedToken}`
            },
            body: JSON.stringify({
                email: userData.email,
                firstName: userData.firstName,
                familyName: userData.familyName,
                dateOfBirth: userData.dateOfBirth,
                company: userData.company,
                position: userData.position,
            })
        })
            .then(response => response.text()) // Assuming the response is JSON containing base64qr
            .then(data => {
                document.getElementById("qrImage").src = `data:image/png;base64,${data}`;
                modal.style.display = "block";
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};