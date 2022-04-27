import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// firebaseConfig object copied from project in Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBAOu3NqaUza7vzDQli9dYRaUHwLZldiWw",
    authDomain: "race-react-firebase.firebaseapp.com",
    projectId: "race-react-firebase",
    storageBucket: "race-react-firebase.appspot.com",
    messagingSenderId: "2118672388",
    appId: "1:2118672388:web:06a1d58d898e9702581551"
};
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const usersRef = collection(db, "users"); // reference to users collection i firestore
export const postsRef = collection(db, "posts"); // reference to posts collection i firestore
