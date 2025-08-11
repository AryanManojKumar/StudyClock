// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC7GTCBLSXuiSCba6nH-3Rr_XZbCOfMffA",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "productivity-clock-f226a.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "productivity-clock-f226a",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "productivity-clock-f226a.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "38234813186",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:38234813186:web:5eeca786dfe9e6c2a3481b",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-YTENRPT27H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;