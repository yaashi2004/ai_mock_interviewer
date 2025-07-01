// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbyC6aNgdvRY6EAXaUVQMvOr0ShduhYn4",
  authDomain: "prepwise-76d8e.firebaseapp.com",
  projectId: "prepwise-76d8e",
  storageBucket: "prepwise-76d8e.firebasestorage.app",
  messagingSenderId: "567792070525",
  appId: "1:567792070525:web:04c5ed96177575017ea614",
  measurementId: "G-V5605N7E3R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);