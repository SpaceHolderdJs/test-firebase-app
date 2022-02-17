import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

firebase.initializeApp({
    apiKey: "AIzaSyCt-pfmXXqty4q-1YwzNKqZo7Q7kAHqyJA",
    authDomain: "test-firebase-project-c38bd.firebaseapp.com",
    projectId: "test-firebase-project-c38bd",
    storageBucket: "test-firebase-project-c38bd.appspot.com",
    messagingSenderId: "855018799518",
    appId: "1:855018799518:web:360c3948fe05346974168f",
    measurementId: "G-66Q11WF63V",
});

export const auth = getAuth();

export const firestore = getFirestore();