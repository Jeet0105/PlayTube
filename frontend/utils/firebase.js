import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "playtubelogin-71590.firebaseapp.com",
  projectId: "playtubelogin-71590",
  storageBucket: "playtubelogin-71590.firebasestorage.app",
  messagingSenderId: "789598101918",
  appId: "1:789598101918:web:9de2dd133dbc3fd863368f",
  measurementId: "G-NV63M8ZX3Y"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };