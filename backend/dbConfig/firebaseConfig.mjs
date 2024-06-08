import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
import admin from "firebase-admin";
import serviceAccount from "../service.json" assert { type: "json" };
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

dotenv.config();
// dotenv.config({ path: import.meta.url + "../.env" });
// Web app's Firebase configuration
// const SERVICE_ACCOUNT = JSON.parse(JSON.stringify(process.env.SERVICE_ACCOUNT));
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};
const dbConfig = initializeApp(firebaseConfig);
const dbAuth = getAuth();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // credential: admin.credential.cert(SERVICE_ACCOUNT)
});
// const dbStore = admin.firestore();
const dbStore = getFirestore(dbConfig);


export { dbAuth, dbStore };