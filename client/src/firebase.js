// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiQ6wH_EPDyW6Sn_RsJTm6p8N26P7nb1E",
  authDomain: "swiadectwo-7bd17.firebaseapp.com",
  projectId: "swiadectwo-7bd17",
  storageBucket: "swiadectwo-7bd17.firebasestorage.app",
  messagingSenderId: "764254296608",
  appId: "1:764254296608:web:fe5eb32f55b5c79909fa45",
  measurementId: "G-N425RJXSCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };