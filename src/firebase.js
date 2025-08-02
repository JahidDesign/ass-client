// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Optional: Firestore
import { getStorage } from "firebase/storage";     // Optional: Storage

// ✅ Firebase configuration object (keep this secure)
const firebaseConfig = {
  apiKey: "AIzaSyAv6Iume1kt4_GlFYxMajhqB9zlumrC-RI",
  authDomain: "bookingresort-b8942.firebaseapp.com",
  projectId: "bookingresort-b8942",
  storageBucket: "bookingresort-b8942.appspot.com",
  messagingSenderId: "266919373033",
  appId: "1:266919373033:web:067541a5b3d85b97706878",
  measurementId: "G-NZHH4MSERB",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);     // Optional: Firestore for storing data
const storage = getStorage(app);  // Optional: Storage for uploading files/images

// ✅ Export the needed services
export { auth, db, storage };
