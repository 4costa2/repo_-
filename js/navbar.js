import { logout } from "./auth.js";

const navbar = document.getElementById("navbar");

navbar.innerHTML = `
<header class="bg-zinc-950 text-white shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 class="text-xl font-bold">
            Modelado
        </h1>

        <nav class="flex items-center gap-6">

            <a href="home.html"
               class="transition hover:text-sky-500">
                Home
            </a>

            <a href="arreglar.html"
               class="transition hover:text-sky-500">
                Calculadora
            </a>


        </nav>

        <button id="btnLogout"
            class="rounded-lg bg-slate-600 px-4 py-2 transition hover:bg-slate-700">
            Cerrar sesión
        </button>

    </div>
</header>
`;

document
    .getElementById("btnLogout")
    .addEventListener("click", logout);