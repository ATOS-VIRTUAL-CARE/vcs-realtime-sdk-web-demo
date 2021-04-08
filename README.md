# realtime-sdk-demo-web

This example application uses the [vcs-realtime-sdk](https://sdk.virtualcareservices.net/) SDK to demonstrate a virtual room users can join with audio and/or video. Two parts make up the application:

1. **Application server**: The application server is a nodejs app that serves two purposes, a) serve the frontend vuejs application, and b) create rooms on behalf of the frontend application using the [REST API](https://sdk.virtualcareservices.net/sdks/rest/) of the VCS Cloud System.

2. **Frontend vue app**: The frontend app uses the vcs-realtime-sdk JavaScript SDK to join the room. Peer-2peer WebRTC is used for media communication.

A live demo is hosted at <https://sdk-demo.virtualcareservices.net/>.

> At this time only two participants can join a room, but that restriction will be lifted shortly.

## Get the code

```bash
git clone https://github.com/ATOS-VIRTUAL-CARE/realtime-sdk-demo-web
cd realtime-sdk-demo-web
npm install
```

## Get an API Key

Contact the system administrator of your VCS system to obtain a `VCS_API_KEY` and add the key to the `/backend/.env` file.

## Run app locally

To run the app locally, there is no need to add any `.env` configuration other than the `VCS_API_KEY` mentioned above. All you need to do is to start the backend and frontend.

```bash
# Start the backend application server and frontend vue app
npm run dev

# Navigate to http://localhost:3000/
```

## Configuration

Description of the `.env` configuration parameters.

### Backend (nodejs)

**VCS_HOST**: Domain of the VCS System. Default is `sandbox.virtualcareservices.net`.

**VCS_API_KEY**: API Key required by backend to authenticate with the VCS System.

**PORT**: Port to listen for frontend app. Default is 3001.

### Frontend (vue)

**VITE_APP_SERVER**: Address of backend server. Default is `localhost:3001`.
