# VCS Realtime SDK sample application for web clients

This sample application uses the [Virtual Care Service (VCS) Realtime JavaScript SDK](https://sdk.virtualcareservices.net/) to demonstrate how users use join virtual rooms to interact with audio and/or video.

The application has two parts:

1. **Application server**: The application server is a Node.js app that serves two purposes, a) serve the frontend Vue.js application, and b) create rooms on behalf of the frontend application using the [VCS REST API](https://sdk.virtualcareservices.net/sdks/rest/).
2. **Frontend Vue app**: The frontend app uses the [VCS Realtime JavaScript SDK](https://sdk.virtualcareservices.net/) to join the virtual room. Peer-2-peer WebRTC is used for media communication.

> At this time only four participants can join a room

## Running application locally

### Getting the code

Clone this repository and install the dependencies.

```bash
git clone https://github.com/ATOS-VIRTUAL-CARE/vcs-realtime-sdk-web-demo
cd vcs-realtime-sdk-web-demo
npm install
```

### Configure the app

#### Application server

Contact the system administrator of your VCS system to obtain a VCS API key and the domain of the VCS system. Update the file `/backend/.env` with the obtained API Key for parameter `VCS_API_KEY`, and the VCS domain for parameter VCS_HOST (without https:// prefix). For the port specify `3001` as the default port `80` might already be in use on your PC.

#### Frontend Vue app

Set the `VITE_APP_SERVER` parameter in file `/frontend/.env` to `localhost:3001`. This tells your web app where the Application server is hosted at.

### Start the app

There are no other dependencies to run the app locally. Once you add the API key as explained above, start the backend and frontend. The application is available at <http://localhost:3000/>.

```bash
# Start the backend application server and frontend Vue app (default port 3000)
npm run dev

# Navigate to http://localhost:3000/
```

### Authentication

By default there is no authentication required to access the `POST /room` endpoint to create rooms. Basic Authentication can be configured in the backend and frontend env files. Set the backend env property `AUTH_TYPE`to `BASIC_AUTH`, and then configure the credentials of a user that has permissions to create rooms via env properties `BASIC_AUTH_USER` & `BASIC_AUTH_PASSWORD`.

## More information

Where to find more information about the VCS Realtime SDKs and APIs.

- [Main page for the VCS SDKs and APIs](https://sdk.virtualcareservices.net/)
- [An overview of how application servers and clients work together to create audio/video sessions](https://sdk.virtualcareservices.net/guide/#overview)
- [JavaScript SDK documentation](https://sdk.virtualcareservices.net/sdks/js/)
- [iOS  SDK documentation](https://sdk.virtualcareservices.net/sdks/ios/)
- [Android SDK documentation](https://sdk.virtualcareservices.net/sdks/android/)
