import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1pCWwPE9yra9maiEoByUZGZ1-lhsGrFo",
    authDomain: "idealab-website.firebaseapp.com",
    projectId: "idealab-website",
    storageBucket: "idealab-website.firebasestorage.app",
    messagingSenderId: "223033510949",
    appId: "1:223033510949:web:081ace3343303cdc9a83cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
