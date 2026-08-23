import { logout } from "./auth.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

const navbar = document.getElementById("navbar");

const estaEnSubcarpeta = ["contrapiso", "techo", "pared"]
    .some(carpeta => window.location.pathname.includes(`/${carpeta}/`));

const base = estaEnSubcarpeta ? "../" : "./";

navbar.innerHTML = `
<header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg text-white">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-4">

        <!-- Logo / Marca -->
        <a href="${base}home.html" class="flex items-center gap-2.5 group no-underline text-white">
            
            <span class="text-lg font-bold tracking-tight group-hover:text-sky-400 transition">
                Constru<span class="text-sky-400">Calc</span>
            </span>
        </a>

        <!-- Navegación central -->
        <nav class="flex items-center gap-2 sm:gap-4 text-sm font-medium">

            <!-- Link Home -->
            <a href="${base}home.html"
               class="px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition flex items-center gap-1.5 no-underline">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Inicio</span>
            </a>

            <!-- Dropdown Calculadoras (Bootstrap Style) -->
            <div class="relative dropdown" id="calcDropdownContainer">
                <button id="btnCalcDropdown"
                        type="button"
                        aria-expanded="false"
                        class="dropdown-toggle px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Calculadoras</span>
                    <svg id="calcChevron" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Menú Dropdown -->
                <div id="calcDropdownMenu"
                     class="dropdown-menu absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 shadow-2xl p-2 hidden z-50 flex flex-col gap-1">
                    
                    <a href="${base}contrapiso/contrapiso.html"
                       class="dropdown-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition no-underline group">
                    
                        <div>
                            <p class="text-sm font-medium leading-none mb-1 text-zinc-200 group-hover:text-white">Contrapiso</p>
                            <p class="text-[11px] text-zinc-500 leading-none">Cálculo de mezcla y volumen</p>
                        </div>
                    </a>

                    <a href="${base}techo/techo.html"
                       class="dropdown-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition no-underline group">
                        
                        <div>
                            <p class="text-sm font-medium leading-none mb-1 text-zinc-200 group-hover:text-white">Techo</p>
                            <p class="text-[11px] text-zinc-500 leading-none">Superficie y materiales</p>
                        </div>
                    </a>

                    <a href="${base}pared/pared.html"
                       class="dropdown-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition no-underline group">
    
                        <div>
                            <p class="text-sm font-medium leading-none mb-1 text-zinc-200 group-hover:text-white">Pared</p>
                            <p class="text-[11px] text-zinc-500 leading-none">Ladrillos y mortero</p>
                        </div>
                    </a>

                </div>
            </div>

        </nav>

        <!-- Botón de Perfil -->
        <button id="btnOpenProfile"
            type="button"
            class="flex items-center gap-2.5 rounded-xl px-2.5 sm:px-3 py-1.5
                   hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60
                   transition text-left shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50">

            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-sky-600/30 to-sky-400/10
                        border border-sky-500/40
                        flex items-center justify-center shadow-inner">
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
                <p class="text-[11px] text-zinc-400 font-normal leading-none mb-1">
                    Bienvenido/a
                </p>
                <p id="navbarUserName"
                   class="text-xs font-semibold text-zinc-200 leading-none">
                    Usuario
                </p>
            </div>
        </button>

    </div>
</header>

<!-- Modal Perfil de Usuario -->
<div id="userModal"
    class="fixed inset-0 z-50 hidden items-center justify-center
           bg-black/75 backdrop-blur-sm px-4">

    <div class="w-full max-w-md rounded-2xl
                bg-zinc-900 border border-zinc-800
                shadow-2xl overflow-hidden animate-fadeIn">

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
                    <h2 class="text-lg font-semibold text-white leading-tight">
                        Mi cuenta
                    </h2>
                    <p class="text-xs text-zinc-400">
                        Información del usuario
                    </p>
                </div>
            </div>

            <button id="btnCloseModal"
                class="text-zinc-500 hover:text-white
                       text-2xl transition p-1 leading-none">
                &times;
            </button>
        </div>

        <div class="p-6 space-y-4">
            <div class="rounded-xl bg-zinc-800/60
                        border border-zinc-700/50 p-4">
                <p class="text-[11px] uppercase tracking-wider
                          text-zinc-400 mb-1 font-semibold">
                    Usuario
                </p>
                <p id="modalUserName"
                   class="text-base font-medium text-white">
                    Cargando...
                </p>
            </div>

            <div class="rounded-xl bg-zinc-800/60
                        border border-zinc-700/50 p-4">
                <p class="text-[11px] uppercase tracking-wider
                          text-zinc-400 mb-1 font-semibold">
                    Correo electrónico
                </p>
                <p id="modalUserEmail"
                   class="text-base font-medium text-white break-all">
                    Cargando...
                </p>
            </div>
        </div>

        <div class="px-6 py-4 border-t border-zinc-800
                    flex items-center justify-between gap-3 bg-zinc-950/40">

            <button id="btnCloseModalBtn"
                class="rounded-xl bg-zinc-800 px-4 py-2.5
                       text-sm text-zinc-300 font-medium
                       hover:bg-zinc-700 transition">
                Volver
            </button>

            <button id="btnLogout"
                class="rounded-xl bg-red-600/90 px-4 py-2.5
                       text-sm font-medium text-white
                       hover:bg-red-600 transition shadow-lg shadow-red-600/20">
                Cerrar sesión
            </button>
        </div>

    </div>
</div>
`;

// Elementos del Modal
const userModal = document.getElementById("userModal");
const btnOpenProfile = document.getElementById("btnOpenProfile");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCloseModalBtn = document.getElementById("btnCloseModalBtn");
const btnLogout = document.getElementById("btnLogout");

const navbarUserName = document.getElementById("navbarUserName");
const modalUserName = document.getElementById("modalUserName");
const modalUserEmail = document.getElementById("modalUserEmail");

// Elementos del Dropdown de Calculadoras
const btnCalcDropdown = document.getElementById("btnCalcDropdown");
const calcDropdownMenu = document.getElementById("calcDropdownMenu");
const calcDropdownContainer = document.getElementById("calcDropdownContainer");
const calcChevron = document.getElementById("calcChevron");

// Toggle del Dropdown de Calculadoras
function toggleCalcDropdown(abrir) {
    const estaAbierto = !calcDropdownMenu.classList.contains("hidden");
    const nuevoEstado = abrir !== undefined ? abrir : !estaAbierto;

    if (nuevoEstado) {
        calcDropdownMenu.classList.remove("hidden");
        btnCalcDropdown.setAttribute("aria-expanded", "true");
        calcChevron.classList.add("rotate-180");
    } else {
        calcDropdownMenu.classList.add("hidden");
        btnCalcDropdown.setAttribute("aria-expanded", "false");
        calcChevron.classList.remove("rotate-180");
    }
}

if (btnCalcDropdown) {
    btnCalcDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCalcDropdown();
    });

    // Cerrar el dropdown al hacer click en cualquier otra parte
    document.addEventListener("click", (e) => {
        if (!calcDropdownContainer.contains(e.target)) {
            toggleCalcDropdown(false);
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            toggleCalcDropdown(false);
            cerrarModal();
        }
    });
}

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