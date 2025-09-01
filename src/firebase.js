import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";     

const firebaseConfig = {
  apiKey: "AIzaSyAv6Iume1kt4_GlFYxMajhqB9zlumrC-RI",
  authDomain: "bookingresort-b8942.firebaseapp.com",
  projectId: "bookingresort-b8942",
  storageBucket: "bookingresort-b8942.appspot.com",
  messagingSenderId: "266919373033",
  appId: "1:266919373033:web:067541a5b3d85b97706878",
  measurementId: "G-NZHH4MSERB",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);     
const storage = getStorage(app);  

// ✅ Create and export the Google provider
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider };
