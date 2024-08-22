# fotofoshi

Fotofoshi is a photo sharing platform that allows users to share photos.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Key](#api-key)
- [Website Domain](#website-domain)
- [Development Server](#development-server)
- [Testing](#testing)
- [License](#license)

## Installation

1. Clone the backend repository:

   git clone https://github.com/serialkiller123/server-fotofoshi.git

2. Serve the backend:

   You need to serve the backend in a way that the mobile app can access it. For example, you can use ngrok or computers local IP to serve it. if you choose to use the local IP, please adjust the CORS in the laravel app to accept the IP.

3. Clone the mobile app repository:

   git clone https://github.com/serialkiller123/fotofoshi.git

4. Install dependencies:

   npm install

## Usage

Before using the app, you need to enter an API key and a website domain. The API key can be obtained from the web front end which is developed with Next.js. You need to enter the API key and the website domain to be able to login.

### API Key

The API key can be obtained from the web front end which is developed with Next.js.

### Website Domain

The website domain is the domain of the fotofoshi web front end. For example, if the fotofoshi web front end is hosted at `fotofoshi.com`, the website domain would be `https://fotofoshi.com`.

## Development Server

To start the development server, run the following command:

    npx expo start

## Testing

To run the tests, run the following command:

    npm run test

## License

Fotofoshi is licensed under the MIT License. See [LICENSE](LICENSE) for details.
