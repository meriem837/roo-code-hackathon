// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo5nHeFMmA4rXTGwGq_PM02Tk386cx_1E",
  authDomain: "roo-code-hackathon.firebaseapp.com",
  projectId: "roo-code-hackathon",
  storageBucket: "roo-code-hackathon.firebasestorage.app",
  messagingSenderId: "537082680130",
  appId: "1:537082680130:web:6c996e34233bddc9f92edb",
  measurementId: "G-XDLSLHRTWM",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
