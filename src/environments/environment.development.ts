export const environment = {
  production: false,

  // Important : These api keys are for demo purpose only.
  // Also Firebase specifies that API keys can be publicly exposed.
  // https://firebase.google.com/docs/projects/api-keys?hl=fr
  // A better approach will be used to hide the apiKey.
  firebase: {
    apiKey: "<FIREBASE_API_KEY>",
    authDomain: "catmash-37c0c.firebaseapp.com",
    projectId: "catmash-37c0c",
    storageBucket: "catmash-37c0c.firebasestorage.app",
    messagingSenderId: "457408874219",
    appId: "1:457408874219:web:2964f6270a8980d153e0ae",
  },
  remoteApiUrl: "https://conseil.latelier.co/data/cats.json",
};
