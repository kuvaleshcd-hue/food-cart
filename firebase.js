// firebase.js — single shared Firebase config for all pages
// Import this in every HTML file instead of duplicating config

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage }     from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCZQl-RwRK7KPLpVDK8a1WzbptcX8HyBzU",
  authDomain:        "food-cart-login.firebaseapp.com",
  projectId:         "food-cart-login",
  storageBucket:     "food-cart-login.firebasestorage.app",   // ✅ unified correct value
  messagingSenderId: "1080008629691",
  appId:             "1:1080008629691:web:d9ce40413e8772b250b89e",
  measurementId:     "G-13V07BQZJS"
};

const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
