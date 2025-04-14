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
6. The Werify Point redirects back and sends the user's data to the app, where it is decoded and stored if valid.


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


### Manage data redirected from the Werify Point

After the user is redirected back from a Werify Point, you can extract their data from the `token` query parameter, verify it using your public key, and store or use it as needed:

```javascript
router.get('/registry', (req, res) => {
  const token = req.query.token;
  const userDetails = {
    email: '', 
    phone: '',
    firstName: '', 
    familyName: '',
    dateOfBirth: '',
    DNI:'',
    NIF_del_organismo:'',
    Organismo:'',
    Puesto:'',
  };

  if (token) {
    const encodedPublicKey = process.env.PUBLIC_KEY;
    const decodedPublicKey = encodedPublicKey.replace(/\\n/g, '\n');
    try {
      const decoded = jwt.verify(token, decodedPublicKey, { algorithms: ['ES256'], ignoreNotBefore: true });
      const decodedString = JSON.stringify(decoded);
      const jsonPart = decodedString.substring(decodedString.indexOf('{'), decodedString.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonPart);
      const storedValuesStr = data.stored_values.replace(/\\"/g, '"');

      const storedValues = JSON.parse(storedValuesStr);

      for (const item of storedValues) {
          if (item.pointer === "/credentialSubject/email" || item.pointer === "/credentialSubject/correo-e") {
            userDetails.email = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/phone") {
            userDetails.phone = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/firstName"  || item.pointer === "/credentialSubject/Nombre") {
            userDetails.firstName = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/familyName"  || item.pointer === "/credentialSubject/Apellido1") {
            userDetails.familyName = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/dateOfBirth") {
            userDetails.dateOfBirth = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/DNI") {
            userDetails.DNI = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/NIF del organismo") {
            userDetails.NIF_del_organismo = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/Organismo") {
            userDetails.Organismo = item.value.trim();
          }
          if (item.pointer === "/credentialSubject/Puesto") {
            userDetails.Puesto = item.value.trim();
          }
      }

      const newUser = new User({ user: userDetails });
      newUser.save()
      .then(() => {
        res.render('successful_registry', { 
          lng: req.language,
          sessionExists: !!req.session.jwt, 
          user: userDetails,
          ISSUER_BASE_URL: process.env.ISSUER_BASE_URL,
        });
      })
      .catch(error => {
        console.error(error);
        res.render('not_found', { lng: req.language, sessionExists: !!req.session.jwt });
      });

    } catch (error) {
      console.log(error);
      res.render('not_found', { lng: req.language, sessionExists: !!req.session.jwt });
    }
  } else {
    res.render('home', { lng: req.language, sessionExists: !!req.session.jwt });
  }
});
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

