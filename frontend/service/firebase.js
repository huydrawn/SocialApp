// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4auQXOuLNH7h_4sdTY-4uTU15stxirfc",
  authDomain: "mobile-e4ed2.firebaseapp.com",
  databaseURL: "https://mobile-e4ed2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobile-e4ed2",
  storageBucket: "mobile-e4ed2.firebasestorage.app",
  messagingSenderId: "804972072101",
  appId: "1:804972072101:web:e644b327acaa187531514c",
  measurementId: "G-HC9B225Z75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export {db};