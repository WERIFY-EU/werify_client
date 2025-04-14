# Werify Client – Deployment & Integration Guide

This application is a **demo** showcasing how to integrate **Werify** services to issue Verifiable Credentials, generate QR codes, and redirect to Werify Points.

---

## 🛠️ Deployment

### Requirements

- Docker and Docker Compose installed.
- Node.js and basic backend knowledge.
- Clone this repository.

### 1. Clone the repository

```bash
git clone https://github.com/WERIFY-EU/werify_client.git
cd werify_client
```

### 2. Configure environment variables

Copy the `.env.example` file as `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials and appropriate configuration.

> **Important**: Check the `.env.example` file for detailed explanations of each variable.

### 3. Start the application with Docker

```bash
docker-compose up --build
```

#### Accessing the Application
Once the application is running, it will be accessible at http://localhost:[PORT], where [PORT] is the port number you specified in your .env file.

#### Additional Notes
 * Ensure that your keys (PRIVATE_OWN_KEY and PUBLIC_OWN_KEY) are kept secure and never shared publicly.
 * For production environments, additional security and configuration measures should be considered.


---

## ⚙️ Technical Integration

This demo is designed to help you easily integrate Werify into your app.

### Main flow

1. The user fills out a form.
2. A **Verifiable Credential** is generated.
3. A QR code is rendered.
4. Scanning the QR allows the user to claim the credential in their wallet.
5. The app provides a redirect to a **Werify Point** (e.g., register or login) using an `<a>` tag or JavaScript function.

---

### Credential issuance + QR generation

The following code snippet handles the issuance of the credential and renders the QR code:

```javascript
document.getElementById("credForm").onsubmit = function (event) {
    event.preventDefault();
    var certificateData = {
        "name": document.getElementById("credName").value,
        "lastName": document.getElementById("credLastName").value,
        "email": userData.email,
        "phone": userData.phone
    }

    fetch('/client/generate-token')
    .then(response => response.json())
    .then(data => {
        const generatedToken = data.token;
        fetch(`${IssuerBaseUrl}/generate_qr/WerifyCertificat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${generatedToken}`
            },
            body: JSON.stringify(certificateData)
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById("qrImageCertificate").src = `data:image/png;base64,${data}`;
            document.getElementById("formFeedback").innerText = "QR Code Generated Successfully!";
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("formFeedback").innerText = "Failed to generate QR Code.";
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};
```

---

### Redirect URL generation

The backend generates Werify Point redirect URLs using `.env` variables:

```javascript
app.get('/config', (req, res) => {
  res.json({
      loginUrl: process.env.BASE_URL + '#' + process.env.LOGIN_URL,
      registryUrl: process.env.BASE_URL + '#' + process.env.REGISTRY_URL,
      certificateUrl: process.env.BASE_URL + '#' + process.env.CERTIFICATE_URL,
      registryUrlAOC: process.env.BASE_URL + '#' + process.env.REGISTRY_URL_AOC,
      registryUrlI2CAT: process.env.BASE_URL + '#' + process.env.REGISTRY_URL_I2CAT,
  });
});
```

---

### Redirect to a Werify Point

Once the URL is obtained from `/config`, you can redirect the user to a Werify Point you previously created:

```javascript
async function redirectToRegistry() {
    const config = await getConfig();
    window.location.href = config.registryUrl;
}
```

---

## 🧠 Notes

- This app uses **vanilla JavaScript** to keep dependencies minimal.
- Credentials are generated from a protected endpoint (`/client/generate-token`) using the keys defined in the environment.
- The generated credentials are of type `WerifyCertificat` in this example.

---

## 📁 Important files

- `.env.example`: includes all required parameters and inline documentation.
- `docker-compose.yml`: launches the app and MongoDB.
- `src/`: contains the frontend source code.

---

## 📬 Contact

For more information about Werify or integration support, visit [https://werify.eu](https://werify.eu) or reach out to us.

