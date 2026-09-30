import { logout } from "./auth.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

const navbar = document.getElementById("navbar");

const estaEnSubcarpeta = ["contrapiso", "techo", "pared"].some((carpeta) =>
    window.location.pathname.includes(`/${carpeta}/`),
);

const base = estaEnSubcarpeta ? "../" : "./";

navbar.innerHTML = `
<header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg text-white">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-3">

        <!-- Logo / Marca -->
        <a href="${base}home.html" class="flex items-center gap-2.5 group no-underline text-white shrink-0">
            <span class="text-lg font-bold tracking-tight group-hover:text-sky-400 transition">
                <span class="text-sky-400">c.</span>Calc
            </span>
        </a>

        <!-- Navegación central (Desktop) -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-3 text-sm font-medium">

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
                    <span>Presupuestos disponibles</span>
                    <svg id="calcChevron" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Menú Dropdown -->
                <div id="calcDropdownMenu"
                     class="dropdown-menu absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 shadow-2xl p-2 hidden z-50 flex flex-col gap-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                    
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

            <!-- Dropdown Proporciones -->
            <div class="relative dropdown" id="propsDropdownContainer">
                <button id="btnPropsDropdown"
                        type="button"
                        aria-expanded="false"
                        class="dropdown-toggle px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Proporciones Materiales</span>
                    <svg id="propsChevron" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Menú Dropdown Proporciones -->
                <div id="propsDropdownMenu"
                     class="dropdown-menu absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800 shadow-2xl p-2 hidden z-50 flex flex-col gap-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                    
                    <a href="${base}contrapiso/proporcionesContrapiso.html"
                       class="dropdown-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition no-underline group">
                        <div>
                            <p class="text-sm font-medium leading-none mb-1 text-zinc-200 group-hover:text-white">Contrapiso</p>
                            <p class="text-[11px] text-zinc-500 leading-none">Ajustar mezcla</p>
                        </div>
                    </a>
                </div>
            </div>
        </nav>

        <!-- Controles a la derecha (Perfil + Botón Hamburguesa Móvil) -->
        <div class="flex items-center gap-2">
            <!-- Botón de Perfil -->
            <button id="btnOpenProfile"
                type="button"
                aria-label="Abrir perfil de usuario"
                class="flex items-center gap-2 rounded-xl px-2 sm:px-3 py-1.5
                       hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60
                       transition text-left shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer">

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

            <!-- Botón Menú Móvil (Hamburguesa) -->
            <button id="btnMobileMenu"
                type="button"
                aria-label="Abrir menú de navegación"
                aria-expanded="false"
                aria-controls="mobileMenu"
                class="md:hidden flex items-center justify-center p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition cursor-pointer">
                <svg id="iconHamburger" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg id="iconClose" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

    </div>

    <!-- Menú Desplegable Móvil -->
    <div id="mobileMenu"
         class="hidden md:hidden border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto">
        
        <!-- Enlace Inicio -->
        <a href="${base}home.html"
           class="mobile-nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-200 hover:text-white hover:bg-zinc-800/70 transition no-underline font-medium">
            <div class="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <span class="text-sm">Inicio</span>
        </a>

        <!-- Acordeón Calculadoras Móvil -->
        <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
            <button id="btnMobileCalcDropdown"
                    type="button"
                    class="w-full flex items-center justify-between px-3.5 py-2.5 text-zinc-200 hover:text-white hover:bg-zinc-800/60 transition font-medium text-sm text-left">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span>Presupuestos disponibles</span>
                </div>
                <svg id="mobileCalcChevron" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-zinc-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div id="mobileCalcMenu" class="px-2 pb-2 pt-1 flex flex-col gap-1 border-t border-zinc-800/50">
                <a href="${base}contrapiso/contrapiso.html"
                   class="mobile-nav-link flex flex-col px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition no-underline">
                    <span class="text-xs font-semibold text-zinc-200">Contrapiso</span>
                    <span class="text-[11px] text-zinc-500">Cálculo de mezcla y volumen</span>
                </a>
                <a href="${base}techo/techo.html"
                   class="mobile-nav-link flex flex-col px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition no-underline">
                    <span class="text-xs font-semibold text-zinc-200">Techo</span>
                    <span class="text-[11px] text-zinc-500">Superficie y materiales</span>
                </a>
                <a href="${base}pared/pared.html"
                   class="mobile-nav-link flex flex-col px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition no-underline">
                    <span class="text-xs font-semibold text-zinc-200">Pared</span>
                    <span class="text-[11px] text-zinc-500">Ladrillos y mortero</span>
                </a>
            </div>
        </div>

        <!-- Acordeón Proporciones Móvil -->
        <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
            <button id="btnMobilePropsDropdown"
                    type="button"
                    class="w-full flex items-center justify-between px-3.5 py-2.5 text-zinc-200 hover:text-white hover:bg-zinc-800/60 transition font-medium text-sm text-left">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span>Proporciones Materiales</span>
                </div>
                <svg id="mobilePropsChevron" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-zinc-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div id="mobilePropsMenu" class="px-2 pb-2 pt-1 flex flex-col gap-1 border-t border-zinc-800/50">
                <a href="${base}contrapiso/proporcionesContrapiso.html"
                   class="mobile-nav-link flex flex-col px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition no-underline">
                    <span class="text-xs font-semibold text-zinc-200">Contrapiso</span>
                    <span class="text-[11px] text-zinc-500">Ajustar mezcla</span>
                </a>
            </div>
        </div>

        <!-- Perfil y Salir en Móvil -->
        <div class="pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
            <div class="flex items-center gap-3 px-2 py-1">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-sky-600/30 to-sky-400/10 border border-sky-500/40 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-5 h-5 text-sky-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25 a8.25 8.25 0 0 1 15 0" />
                    </svg>
                </div>
                <div class="overflow-hidden">
                    <p id="mobileNavbarUserName" class="text-xs font-semibold text-white truncate">Usuario</p>
                    <p id="mobileNavbarUserEmail" class="text-[11px] text-zinc-400 truncate">No disponible</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <button id="btnMobileOpenProfile" type="button" class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi cuenta</span>
                </button>
                <button id="btnMobileLogout" type="button" class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-xs font-medium text-red-400 hover:text-red-300 transition cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>

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
                       text-2xl transition p-1 leading-none cursor-pointer">
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
                       hover:bg-zinc-700 transition cursor-pointer">
                Volver
            </button>

            <button id="btnLogout"
                class="rounded-xl bg-red-600/90 px-4 py-2.5
                       text-sm font-medium text-white
                       hover:bg-red-600 transition shadow-lg shadow-red-600/20 cursor-pointer">
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

// Elementos del Dropdown de Calculadoras (Desktop)
const btnCalcDropdown = document.getElementById("btnCalcDropdown");
const calcDropdownMenu = document.getElementById("calcDropdownMenu");
const calcDropdownContainer = document.getElementById("calcDropdownContainer");
const calcChevron = document.getElementById("calcChevron");

// Toggle del Dropdown de Calculadoras
function toggleCalcDropdown(abrir) {
    if (!calcDropdownMenu || !btnCalcDropdown) return;
    const estaAbierto = !calcDropdownMenu.classList.contains("hidden");
    const nuevoEstado = abrir !== undefined ? abrir : !estaAbierto;

    if (nuevoEstado) {
        calcDropdownMenu.classList.remove("hidden");
        btnCalcDropdown.setAttribute("aria-expanded", "true");
        if (calcChevron) calcChevron.classList.add("rotate-180");
        if (typeof togglePropsDropdown === "function") togglePropsDropdown(false);
    } else {
        calcDropdownMenu.classList.add("hidden");
        btnCalcDropdown.setAttribute("aria-expanded", "false");
        if (calcChevron) calcChevron.classList.remove("rotate-180");
    }
}

if (btnCalcDropdown && calcDropdownContainer) {
    let dropdownTimeout = null;

    calcDropdownContainer.addEventListener("mouseenter", () => {
        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
            dropdownTimeout = null;
        }
        toggleCalcDropdown(true);
    });

    calcDropdownContainer.addEventListener("mouseleave", () => {
        dropdownTimeout = setTimeout(() => {
            toggleCalcDropdown(false);
        }, 150);
    });

    btnCalcDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCalcDropdown();
    });
}

// LÓGICA DEL DROPDOWN DE PROPORCIONES (Desktop)
const btnPropsDropdown = document.getElementById("btnPropsDropdown");
const propsDropdownMenu = document.getElementById("propsDropdownMenu");
const propsDropdownContainer = document.getElementById("propsDropdownContainer");
const propsChevron = document.getElementById("propsChevron");

function togglePropsDropdown(abrir) {
    if (!propsDropdownMenu || !btnPropsDropdown) return;
    const estaAbierto = !propsDropdownMenu.classList.contains("hidden");
    const nuevoEstado = abrir !== undefined ? abrir : !estaAbierto;

    if (nuevoEstado) {
        propsDropdownMenu.classList.remove("hidden");
        btnPropsDropdown.setAttribute("aria-expanded", "true");
        if (propsChevron) propsChevron.classList.add("rotate-180");
        if (typeof toggleCalcDropdown === "function") toggleCalcDropdown(false);
    } else {
        propsDropdownMenu.classList.add("hidden");
        btnPropsDropdown.setAttribute("aria-expanded", "false");
        if (propsChevron) propsChevron.classList.remove("rotate-180");
    }
}

if (btnPropsDropdown && propsDropdownContainer) {
    let propsDropdownTimeout = null;

    propsDropdownContainer.addEventListener("mouseenter", () => {
        if (propsDropdownTimeout) clearTimeout(propsDropdownTimeout);
        togglePropsDropdown(true);
    });

    propsDropdownContainer.addEventListener("mouseleave", () => {
        propsDropdownTimeout = setTimeout(() => {
            togglePropsDropdown(false);
        }, 150);
    });

    btnPropsDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePropsDropdown();
    });
}

// LÓGICA DEL MENÚ MÓVIL
const mobileMenu = document.getElementById("mobileMenu");
const btnMobileMenu = document.getElementById("btnMobileMenu");
const iconHamburger = document.getElementById("iconHamburger");
const iconClose = document.getElementById("iconClose");

const btnMobileCalcDropdown = document.getElementById("btnMobileCalcDropdown");
const mobileCalcMenu = document.getElementById("mobileCalcMenu");
const mobileCalcChevron = document.getElementById("mobileCalcChevron");

const btnMobilePropsDropdown = document.getElementById("btnMobilePropsDropdown");
const mobilePropsMenu = document.getElementById("mobilePropsMenu");
const mobilePropsChevron = document.getElementById("mobilePropsChevron");

const mobileNavbarUserName = document.getElementById("mobileNavbarUserName");
const mobileNavbarUserEmail = document.getElementById("mobileNavbarUserEmail");
const btnMobileOpenProfile = document.getElementById("btnMobileOpenProfile");
const btnMobileLogout = document.getElementById("btnMobileLogout");

function toggleMobileMenu(abrir) {
    if (!mobileMenu || !btnMobileMenu) return;
    const estaAbierto = !mobileMenu.classList.contains("hidden");
    const nuevoEstado = abrir !== undefined ? abrir : !estaAbierto;

    if (nuevoEstado) {
        mobileMenu.classList.remove("hidden");
        btnMobileMenu.setAttribute("aria-expanded", "true");
        if (iconHamburger) iconHamburger.classList.add("hidden");
        if (iconClose) iconClose.classList.remove("hidden");
    } else {
        mobileMenu.classList.add("hidden");
        btnMobileMenu.setAttribute("aria-expanded", "false");
        if (iconHamburger) iconHamburger.classList.remove("hidden");
        if (iconClose) iconClose.classList.add("hidden");
    }
}

if (btnMobileMenu) {
    btnMobileMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
}

if (btnMobileCalcDropdown && mobileCalcMenu) {
    btnMobileCalcDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        const estaOculto = mobileCalcMenu.classList.contains("hidden");
        if (estaOculto) {
            mobileCalcMenu.classList.remove("hidden");
            if (mobileCalcChevron) mobileCalcChevron.classList.add("rotate-180");
        } else {
            mobileCalcMenu.classList.add("hidden");
            if (mobileCalcChevron) mobileCalcChevron.classList.remove("rotate-180");
        }
    });
}

if (btnMobilePropsDropdown && mobilePropsMenu) {
    btnMobilePropsDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        const estaOculto = mobilePropsMenu.classList.contains("hidden");
        if (estaOculto) {
            mobilePropsMenu.classList.remove("hidden");
            if (mobilePropsChevron) mobilePropsChevron.classList.add("rotate-180");
        } else {
            mobilePropsMenu.classList.add("hidden");
            if (mobilePropsChevron) mobilePropsChevron.classList.remove("rotate-180");
        }
    });
}

// Cerrar menú móvil al hacer click en cualquiera de sus enlaces
document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        toggleMobileMenu(false);
    });
});

if (btnMobileOpenProfile) {
    btnMobileOpenProfile.addEventListener("click", () => {
        toggleMobileMenu(false);
        cargarDatosUsuario(auth.currentUser);
        userModal.classList.remove("hidden");
        userModal.classList.add("flex");
    });
}

if (btnMobileLogout) {
    btnMobileLogout.addEventListener("click", async () => {
        toggleMobileMenu(false);
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
}

// Cerrar menús al hacer click afuera
document.addEventListener("click", (e) => {
    if (calcDropdownContainer && !calcDropdownContainer.contains(e.target)) {
        toggleCalcDropdown(false);
    }
    if (propsDropdownContainer && !propsDropdownContainer.contains(e.target)) {
        togglePropsDropdown(false);
    }
    if (mobileMenu && btnMobileMenu && !mobileMenu.contains(e.target) && !btnMobileMenu.contains(e.target)) {
        toggleMobileMenu(false);
    }
});

// Cerrar con tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        toggleCalcDropdown(false);
        togglePropsDropdown(false);
        toggleMobileMenu(false);
        cerrarModal();
    }
});

// Cerrar menú móvil al redimensionar a pantalla de escritorio
window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        toggleMobileMenu(false);
    }
});

function cargarDatosUsuario(usuario) {
    if (!usuario) {
        if (navbarUserName) navbarUserName.textContent = "Usuario";
        if (modalUserName) modalUserName.textContent = "No disponible";
        if (modalUserEmail) modalUserEmail.textContent = "No disponible";
        if (mobileNavbarUserName) mobileNavbarUserName.textContent = "Usuario";
        if (mobileNavbarUserEmail) mobileNavbarUserEmail.textContent = "No disponible";
        return;
    }

    const nombre =
        usuario.displayName || usuario.email?.split("@")[0] || "Usuario";
    const correo = usuario.email || "No disponible";

    if (navbarUserName) navbarUserName.textContent = nombre;
    if (modalUserName) modalUserName.textContent = nombre;
    if (modalUserEmail) modalUserEmail.textContent = correo;
    if (mobileNavbarUserName) mobileNavbarUserName.textContent = nombre;
    if (mobileNavbarUserEmail) mobileNavbarUserEmail.textContent = correo;
}

if (btnOpenProfile) {
    btnOpenProfile.addEventListener("click", () => {
        cargarDatosUsuario(auth.currentUser);
        userModal.classList.remove("hidden");
        userModal.classList.add("flex");
    });
}

function cerrarModal() {
    if (userModal) {
        userModal.classList.add("hidden");
        userModal.classList.remove("flex");
    }
}

if (btnCloseModal) btnCloseModal.addEventListener("click", cerrarModal);
if (btnCloseModalBtn) btnCloseModalBtn.addEventListener("click", cerrarModal);

if (userModal) {
    userModal.addEventListener("click", (event) => {
        if (event.target === userModal) {
            cerrarModal();
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
}

onAuthStateChanged(auth, (usuario) => {
    cargarDatosUsuario(usuario);
});
