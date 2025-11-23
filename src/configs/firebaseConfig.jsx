// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import * as firebase from 'firebase';

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // For authentication


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzbEc4qvRzHXLNmvYmyMZaUNDM2SU26KU",
  authDomain: "my-project-1514260708230.firebaseapp.com",
  databaseURL: "https://my-project-1514260708230.firebaseio.com",
  projectId: "my-project-1514260708230",
  storageBucket: "my-project-1514260708230.firebasestorage.app",
  messagingSenderId: "392370505854",
  appId: "1:392370505854:web:4d21effaadecb67688b02f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, app, db };

