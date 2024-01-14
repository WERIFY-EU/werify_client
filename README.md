# Deployment Guide for werify_client Project

This guide outlines the steps to deploy the werify_client project using Docker. The project requires a MongoDB database and uses environment variables to manage configuration settings.

## Prerequisites

- Docker and Docker Compose installed on your system.
- Basic knowledge of Docker and Node.js environments.

## Setup

### Step 1: Clone the Repository

Clone the project repository to your local machine. If the repository is private, ensure you have the necessary permissions.

```bash
git clone https://github.com/WERIFY-EU/werify_client.git
cd werify_client
```
### Step 2: Create the .env File

You must create a .env file in the root directory of the project. This file will contain environment variables required for the project's configuration.

Here are the variables you need to define:

 * MONGODB_URI: The URI for connecting to your MongoDB instance. For local development, you can use mongodb://mongo:27017/client_werifydb.
 * PORT: The port on which your Node.js application will run. For example, 3002.
 * PUBLIC_KEY: A public key for Werify. Replace this with your actual public key.
 * PRIVATE_OWN_KEY: Your private key. Ensure that it's formatted in a single line. 
 * LOGIN_URL=This is the URI for the Werify point that you have previously configured within the Werify platform.  You only need to specify the part of the URI that follows after "https://staging.werify.eu/#". Do not include "https://staging.werify.eu/#" in this variable. Example: "/werify_point_kiosk/sultry+silicon+prance+designate+bonehead".
 * REGISTRY_URL=This environment variable represents the URI for the Werify point that has been set up in advance on the Werify platform.  Only include the segment of the URI that comes after "https://staging.werify.eu/#". The initial part of the URL ("https://staging.werify.eu/#") should not be included in this variable. Example: "/werify_point_kiosk/traitor+tantrum+culinary+passport+humvee".
 
 Example structure:

```bash
PRIVATE_OWN_KEY=-----BEGIN EC PRIVATE KEY-----\nYourPrivateKeyHere\n-----END EC PRIVATE KEY-----
```

 * PUBLIC_OWN_KEY: Your public key associated with the private key above. Format it in a single line as well. 
 Example structure:

```bash
PUBLIC_OWN_KEY=-----BEGIN PUBLIC KEY-----\nYourPublicKeyHere\n-----END PUBLIC KEY-----
```

Your .env file should look something like this:

```bash
MONGODB_URI=mongodb://mongo:27017/client_werifydb
PORT=3002
PUBLIC_KEY=YourPublicKeyHere
PRIVATE_OWN_KEY=YourPrivateKeyHere
PUBLIC_OWN_KEY=YourPublicKeyHere
LOGIN_URL=/werify_point_kiosk/sultry+silicon+prance+designate+bonehead
REGISTRY_URL=/werify_point_kiosk/traitor+tantrum+culinary+passport+humvee
```

### Step 3: Build and Run with Docker
After setting up the .env file, you can use Docker Compose to build and run your application.

```bash
docker-compose up --build
```

This command will build the Docker image for your Node.js application and start the services defined in your docker-compose.yml file.

### Accessing the Application
Once the application is running, it will be accessible at http://localhost:[PORT], where [PORT] is the port number you specified in your .env file.

### Additional Notes
 * Ensure that your keys (PRIVATE_OWN_KEY and PUBLIC_OWN_KEY) are kept secure and never shared publicly.
 * For production environments, additional security and configuration measures should be considered.