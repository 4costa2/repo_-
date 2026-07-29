import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBXhVT3qEp8zWJea6EanCIqhgzud4iWgDI",
    authDomain: "modelado-app.firebaseapp.com",
    projectId: "modelado-app",
    storageBucket: "modelado-app.firebasestorage.app",
    messagingSenderId: "77716266038",
    appId: "1:77716266038:web:8c757b02860bea99358c97"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)