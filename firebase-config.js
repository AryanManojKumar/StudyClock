// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7GTCBLSXuiSCba6nH-3Rr_XZbCOfMffA",
    authDomain: "productivity-clock-f226a.firebaseapp.com",
    projectId: "productivity-clock-f226a",
    storageBucket: "productivity-clock-f226a.firebasestorage.app",
    messagingSenderId: "38234813186",
    appId: "1:38234813186:web:5eeca786dfe9e6c2a3481b",
    measurementId: "G-YTENRPT27H"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);