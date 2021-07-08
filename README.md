# VCS Realtime SDK sample application for web clients

This sample application uses the [Virtual Care Service (VCS) Realtime JavaScript SDK](https://sdk.virtualcareservices.net/) to demonstrate how users use join virtual rooms to interact with audio and/or video.

The application has two parts:

1. **Application server**: The application server is a Node.js app that serves two purposes, a) serve the frontend Vue.js application, and b) create rooms on behalf of the frontend application using the [VCS REST API](https://sdk.virtualcareservices.net/sdks/rest/).
2. **Frontend Vue app**: The frontend app uses the [VCS Realtime JavaScript SDK](https://sdk.virtualcareservices.net/) to join the virtual room. Peer-2peer WebRTC is used for media communication.

A live demo is hosted at <https://sdk-demo.virtualcareservices.net/>.

> At this time only two participants can join a room - multi-party calls coming soon.

## Running the code on your environment

### Getting the code

Clone this repository and install the dependencies.

```bash
git clone https://github.com/ATOS-VIRTUAL-CARE/vcs-realtime-sdk-web-demo
cd vcs-realtime-sdk-web-demo
npm install
```

### Getting an API key

Contact the system administrator of your VCS system to obtain a VCS API key. Once you have the key, add the key to the `/backend/.env` file, in the `VCS_API_KEY` parameter.

**IMPORTANT**: Do not commit the key to any public repository. Anyone with the key will be able to make calls on that system.

### Running the app locally

There are no other dependencies to run the app locally. Once you add the API key as explained above, start the backend and frontend. The application is available at <http://localhost:3000/>.

```bash
# Start the backend application server and frontend Vue app
npm run dev

# Navigate to http://localhost:3000/
```

## Running the code with a VCS system

To connect to an external VCS system, configure the following parameters in the `.env` file.

### Backend (Node.js)

- `VCS_HOST`: Domain of the VCS system. Default is `sandbox.virtualcareservices.net`.
- `VCS_API_KEY`: API key required by the backend to authenticate with the VCS system. It can be the same you used to run the code locally.
- `PORT`: Port to listen for frontend app. Default is 3001.

### Frontend (Vue)

- `VITE_APP_SERVER`: Address of backend server. Default is `localhost:3001`.

## More information

Where to find more information about the VCS Realtime SDKs and APIs.

- [Main page for the VCS SDKs and APIs](https://sdk.virtualcareservices.net/)
- [An overview of how application servers and clients work together to create audio/video sessions](https://sdk.virtualcareservices.net/guide/#overview)
- [JavaScript SDK documentation](https://sdk.virtualcareservices.net/sdks/js/)
- [iOS  SDK documentation](https://sdk.virtualcareservices.net/sdks/ios/)
- [Android SDK documentation](https://sdk.virtualcareservices.net/sdks/android/)
