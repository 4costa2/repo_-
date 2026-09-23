import { auth } from "./firebase.js";
import { supabase } from "./supabase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";


export async function login(username, email, contraseña) {

    const credential = await signInWithEmailAndPassword(
        auth,
        email,
        contraseña
    );

    const user = credential.user;

    // Comprobar que el username coincida con el displayName
    if (user.displayName !== username) {

        await signOut(auth);

        throw new Error("El username no coincide con el usuario");
    }

    await supabase.from("usuarios").upsert({
        firebase_uid: user.uid,
        nombre: user.displayName || username,
        email: user.email
    });

    return credential;
}


export async function registro(username, email, contraseña) {

    const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        contraseña
    );

    // Guardar el username como displayName
    await updateProfile(credential.user, {
        displayName: username
    });

    // Cuando se registra en Firebase, lo registramos en Supabase también
    const { error } = await supabase.from("usuarios").insert({
        firebase_uid: credential.user.uid,
        nombre: username,
        email: email
    });

    if (error) {
        console.error("Error al guardar en Supabase:", error);
    }

    return credential;


}



export async function logout() {

    await signOut(auth);

    location.replace("/index.html");
}