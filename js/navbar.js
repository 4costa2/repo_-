import { logout } from "./auth.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

const navbar = document.getElementById("navbar");

const estaEnSubcarpeta = ["contrapiso", "techo", "pared"]
    .some(carpeta => window.location.pathname.includes(`/${carpeta}/`));

const base = estaEnSubcarpeta ? "../" : "./";

navbar.innerHTML = `
<header class="bg-zinc-950 text-white shadow-md border-b border-zinc-800">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-6">

        <h1 class="text-xl font-bold shrink-0">
            Modelado
        </h1>

        <nav class="flex items-center gap-6 text-sm">

            <a href="${base}home.html"
               class="transition hover:text-sky-400">
                Home
            </a>

            <a href="${base}contrapiso/contrapiso.html"
               class="transition hover:text-sky-400">
                Calcular contrapiso
            </a>

            <a href="${base}techo/techo.html"
               class="transition hover:text-sky-400">
                Calcular techo
            </a>

            <a href="${base}pared/pared.html"
               class="transition hover:text-sky-400">
                Calcular pared
            </a>

        </nav>

        <button id="btnOpenProfile"
            class="flex items-center gap-2 rounded-xl px-3 py-2
                   hover:bg-zinc-800 transition text-left shrink-0">

            <div class="w-9 h-9 rounded-full bg-sky-600/20
                        border border-sky-500/30
                        flex items-center justify-center">

                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    class="w-5 h-5 text-sky-400">

                    <path stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0
                        3.75 3.75 0 0 1 7.5 0ZM4.5 20.25
                        a8.25 8.25 0 0 1 15 0" />
                </svg>

            </div>

            <div class="hidden sm:block">
                <p class="text-xs text-zinc-500">
                    Bienvenido/a
                </p>

                <p id="navbarUserName"
                   class="text-sm font-medium text-zinc-200">
                    Usuario
                </p>
            </div>

        </button>

    </div>
</header>


<div id="userModal"
    class="fixed inset-0 z-50 hidden items-center justify-center
           bg-black/70 backdrop-blur-sm px-4">

    <div class="w-full max-w-md rounded-2xl
                bg-zinc-900 border border-zinc-800
                shadow-2xl overflow-hidden">

        <div class="flex items-center justify-between
                    px-6 py-5 border-b border-zinc-800">

            <div class="flex items-center gap-3">

                <div class="w-11 h-11 rounded-full
                            bg-sky-600/20
                            border border-sky-500/30
                            flex items-center justify-center">

                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        class="w-6 h-6 text-sky-400">

                        <path stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0
                            3.75 3.75 0 0 1 7.5 0ZM4.5 20.25
                            a8.25 8.25 0 0 1 15 0" />
                    </svg>

                </div>

                <div>
                    <h2 class="text-lg font-semibold text-white">
                        Mi cuenta
                    </h2>

                    <p class="text-xs text-zinc-500">
                        Información del usuario
                    </p>
                </div>

            </div>

            <button id="btnCloseModal"
                class="text-zinc-500 hover:text-white
                       text-2xl transition">
                &times;
            </button>

        </div>


        <div class="p-6 space-y-4">

            <div class="rounded-xl bg-zinc-800/70
                        border border-zinc-700/50 p-4">

                <p class="text-xs uppercase tracking-wider
                          text-zinc-500 mb-1">
                    Usuario
                </p>

                <p id="modalUserName"
                   class="text-base font-medium text-white">
                    Cargando...
                </p>

            </div>


            <div class="rounded-xl bg-zinc-800/70
                        border border-zinc-700/50 p-4">

                <p class="text-xs uppercase tracking-wider
                          text-zinc-500 mb-1">
                    Correo electrónico
                </p>

                <p id="modalUserEmail"
                   class="text-base font-medium text-white break-all">
                    Cargando...
                </p>

            </div>

        </div>


        <div class="px-6 py-5 border-t border-zinc-800
                    flex items-center justify-between gap-3">

            <button id="btnCloseModalBtn"
                class="rounded-lg bg-zinc-800 px-4 py-2
                       text-sm text-zinc-300
                       hover:bg-zinc-700 transition">
                Volver
            </button>

            <button id="btnLogout"
                class="rounded-lg bg-red-600/90 px-4 py-2
                       text-sm font-medium text-white
                       hover:bg-red-600 transition">
                Cerrar sesión
            </button>

        </div>

    </div>
</div>
`;

const userModal = document.getElementById("userModal");
const btnOpenProfile = document.getElementById("btnOpenProfile");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCloseModalBtn = document.getElementById("btnCloseModalBtn");
const btnLogout = document.getElementById("btnLogout");

const navbarUserName = document.getElementById("navbarUserName");
const modalUserName = document.getElementById("modalUserName");
const modalUserEmail = document.getElementById("modalUserEmail");

function cargarDatosUsuario(usuario) {

    if (!usuario) {
        navbarUserName.textContent = "Usuario";
        modalUserName.textContent = "No disponible";
        modalUserEmail.textContent = "No disponible";
        return;
    }

    const nombre = usuario.displayName ||
                   usuario.email?.split("@")[0] ||
                   "Usuario";

    const correo = usuario.email || "No disponible";

    navbarUserName.textContent = nombre;
    modalUserName.textContent = nombre;
    modalUserEmail.textContent = correo;
}

btnOpenProfile.addEventListener("click", () => {

    cargarDatosUsuario(auth.currentUser);

    userModal.classList.remove("hidden");
    userModal.classList.add("flex");
});

function cerrarModal() {

    userModal.classList.add("hidden");
    userModal.classList.remove("flex");
}

btnCloseModal.addEventListener("click", cerrarModal);
btnCloseModalBtn.addEventListener("click", cerrarModal);

userModal.addEventListener("click", (event) => {

    if (event.target === userModal) {
        cerrarModal();
    }
});

btnLogout.addEventListener("click", async () => {

    try {
        await logout();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});

onAuthStateChanged(auth, (usuario) => {
    cargarDatosUsuario(usuario);
});