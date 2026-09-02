import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

// Detectar si la página actual está en una subcarpeta para redirigir correctamente sin dar 404
const estaEnSubcarpeta = ["contrapiso", "techo", "pared"].some((carpeta) =>
    window.location.pathname.includes(`/${carpeta}/`)
);

const rutaLogin = estaEnSubcarpeta ? "../index.html" : "index.html";

function verificarUsuario() {
    if (!auth.currentUser) {
        location.replace(rutaLogin);
    }
}

// Al cargar o cambiar el estado de sesión, si no hay usuario redirige a index.html
onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.replace(rutaLogin);
    }
});

// Manejar cuando el usuario vuelve hacia atrás con el botón del navegador
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        verificarUsuario();
    }
});
