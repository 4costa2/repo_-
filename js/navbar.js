import { logout } from "./auth.js";

const navbar = document.getElementById("navbar");

navbar.innerHTML = `
<header class="bg-zinc-950 text-white shadow-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 class="text-xl font-bold">
            Modelado
        </h1>

        <nav class="flex items-center gap-6">

            <a href="/home.html"
               class="transition hover:text-sky-500">
                Home
            </a>

            <a href="/contrapiso/contrapiso.html"
               class="transition hover:text-sky-500">
                Calcular contrapiso
            </a>

            <a href="/techo/techo.html"
               class="transition hover:text-sky-500">
                Calcular techo
            </a>

            <a href="/pared/pared.html"
               class="transition hover:text-sky-500">
                Calcular pared
            </a>

            <!-- select autodesplegable -->
                <div class="relative group inline-block">

  <!-- Botón principal -->
  <button class="px-4 py-2 bg-black text-white rounded-md">
    Opciones
  </button>

  <!-- Menú desplegable -->
  <div class="absolute hidden group-hover:flex flex-col w-48 bg-black text-white border border-gray-800 rounded-md shadow-lg z-10 py-2">
    <a href="/contrapiso/contrapiso.html" class="px-4 py-2 transition hover:text-sky-500 hover:bg-gray-900">
      Calcular contrapiso
    </a>

    <a href="/techo/techo.html" class="px-4 py-2 transition hover:text-sky-500 hover:bg-gray-900">
      Calcular techo
    </a>

    <a href="/pared/pared.html" class="px-4 py-2 transition hover:text-sky-500 hover:bg-gray-900">
      Calcular pared
    </a>
  </div>

</div> 


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