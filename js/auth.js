import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

export async function login(email, contraseña) {

    return await signInWithEmailAndPassword(
        auth,
        email,
        contraseña
    )
}

export async function registro(email, contraseña) {

    return await createUserWithEmailAndPassword(
        auth,
        email,
        contraseña
    )
}

export async function logout() {

    await signOut(auth)
    
    location.replace("index.html")
}