
import { supabase } from "./supabase.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

// Referencias a los elementos del DOM en home.html
const contenedor = document.getElementById("contenedorPresupuestos");
const btnRecargar = document.getElementById("btnRecargar");
const nombreUsuarioHero = document.getElementById("nombreUsuarioHero");
const contadorPresupuestos = document.getElementById("contadorPresupuestos");

// Botón "Actualizar": Permite al usuario recargar manualmente la lista de presupuestos
if (btnRecargar) {
    btnRecargar.addEventListener("click", () => {
        if (auth.currentUser) {
            btnRecargar.classList.add("opacity-50"); // Efecto visual de carga
            cargarPresupuestos(auth.currentUser.uid).finally(() => {
                btnRecargar.classList.remove("opacity-50");
            });
        }
    });
}

// OBSERVADOR DE AUTENTICACIÓN (Firebase Auth)
// Se dispara automáticamente cuando el estado de la sesión cambia o se inicializa

onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
        // 1. Mostrar el nombre del usuario en el saludo de bienvenida
        if (nombreUsuarioHero) {
            // Usa el displayName o la primera parte del email antes del '@'
            const nombre = usuario.displayName || usuario.email.split("@")[0];
            nombreUsuarioHero.textContent = nombre;
        }

        // 2. Cargar los presupuestos guardados de ese usuario
        if (contenedor) {
            cargarPresupuestos(usuario.uid);
        }
    }
});


async function cargarPresupuestos(uid) {
    if (!contenedor) return;

    // Indicador visual de "Cargando..." mientras se espera la respuesta de Supabase
    contenedor.innerHTML = `
        <div class="col-span-full text-center py-12 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl">
            <p class="text-sm text-zinc-400 animate-pulse">Buscando tus presupuestos guardados...</p>
        </div>
    `;

    try {
        // Consulta SQL a Supabase:
        // SELECT * FROM presupuestos WHERE firebase_uid = uid ORDER BY created_at DESC;
        const { data: presupuestos, error } = await supabase
            .from("presupuestos")
            .select("*")
            .eq("firebase_uid", uid)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Actualizar el número en la insignia del contador (ej: "3 guardados")
        if (contadorPresupuestos) {
            const total = presupuestos ? presupuestos.length : 0;
            contadorPresupuestos.textContent = `${total} ${total === 1 ? 'guardado' : 'guardados'}`;
        }

        // Si el usuario no tiene cálculos guardados, mostrar mensaje amigable (Empty State)
        if (!presupuestos || presupuestos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-span-full text-center py-12 px-6 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl">
                    <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-zinc-200 font-semibold text-base mb-1">Aún no tienes presupuestos guardados</h3>
                    <p class="text-xs text-zinc-400 max-w-sm mx-auto mb-5 leading-relaxed">
                        Calculá los materiales de tu obra en Contrapiso, Pared o Techo y guardá tus resultados para verlos aquí.
                    </p>
                </div>
            `;
            return;
        }

        // Generar dinámicamente las tarjetas HTML para cada presupuesto encontrado
        contenedor.innerHTML = presupuestos.map((p) => {
            // FORMATO DE FECHA:
            // Convierte el timestamp UTC de la base de datos (p.created_at)
            // al formato local argentino (DD/MM/AAAA) con 2 dígitos por campo.
            const fecha = new Date(p.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            // Recuperación de los objetos JSONB almacenados en la base de datos
            const medidas = p.medidas || {};
            const materiales = p.materiales || {};

            // FORMATO DE MONEDA:
            // Convierte el valor numérico en formato de moneda local con separador de miles (ej: $ 150.000)
            const costo = p.costo_total ? `$ ${Number(p.costo_total).toLocaleString("es-AR")}` : "Sin costo";

            // Asignación de colores para las etiquetas (badges) según el tipo de presupuesto
            let badgeStyle = "text-sky-400 bg-sky-500/10 border-sky-500/20";
            if (p.tipo === "pared") {
                badgeStyle = "text-amber-400 bg-amber-500/10 border-amber-500/20";
            } else if (p.tipo === "techo") {
                badgeStyle = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            }

            // Plantilla HTML de cada tarjeta de presupuesto
            return `
                <div class="relative overflow-hidden bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-5 shadow-lg transition flex flex-col justify-between" id="card-${p.id}">
                    <div>
                        <div class="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <!-- Tipo de presupuesto (Contrapiso, Pared, Techo) -->
                                <span class="text-[10px] font-semibold ${badgeStyle} border px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    ${p.tipo || 'Cálculo'}
                                </span>
                                <!-- Título dado por el usuario -->
                                <h3 class="text-base font-bold text-white mt-2 leading-snug">
                                    ${p.titulo || 'Presupuesto'}
                                </h3>
                                <!-- Fecha formateada -->
                                <p class="text-[11px] text-zinc-500 mt-0.5">${fecha}</p>
                            </div>

                            <!-- Botón para Eliminar: llama a la función global eliminarPresupuesto pasando el ID -->
                            <button onclick="eliminarPresupuesto(${p.id})" title="Eliminar presupuesto"
                                class="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-500/20 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        <!-- Grilla con el detalle técnico de medidas y materiales -->
                        <div class="grid grid-cols-2 gap-2 my-3 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                            <div>
                                <span class="text-zinc-500 block text-[11px]">Área:</span>
                                <span class="text-zinc-200 font-semibold">${medidas.area_m2 ? medidas.area_m2 + ' m²' : '-'}</span>
                            </div>
                            <div>
                                <span class="text-zinc-500 block text-[11px]">Volumen:</span>
                                <span class="text-zinc-200 font-semibold">${medidas.volumen_m3 ? medidas.volumen_m3 + ' m³' : '-'}</span>
                            </div>
                            <div>
                                <span class="text-zinc-500 block text-[11px]">Cemento:</span>
                                <span class="text-sky-400 font-semibold">${materiales.cemento_bolsas ? materiales.cemento_bolsas + ' bolsas' : '-'}</span>
                            </div>
                            <div>
                                <span class="text-zinc-500 block text-[11px]">Arena / Ripio:</span>
                                <span class="text-zinc-200 font-semibold">${materiales.arena_m3 || 0}m³ / ${materiales.ripio_m3 || 0}m³</span>
                            </div>
                        </div>
                    </div>

                    <!-- Pie de la tarjeta con el costo total estimado -->
                    <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between mt-1">
                        <div>
                            <span class="text-[10px] text-zinc-500 block uppercase tracking-wider">Total Estimado</span>
                            <span class="text-base font-bold text-sky-400">${costo}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

    } catch (err) {
        console.error("Error al cargar presupuestos:", err);
        contenedor.innerHTML = `
            <div class="col-span-full text-center py-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <p class="text-xs text-rose-400">Error al cargar presupuestos: ${err.message}</p>
            </div>
        `;
    }
}



window.eliminarPresupuesto = async function (id) {
    // 1. Confirmación de seguridad para evitar borrados accidentales
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este presupuesto?");
    if (!confirmar) return;

    try {
        // 2. Eliminar el registro en Supabase mediante su ID (Primary Key)
        // DELETE FROM presupuestos WHERE id = id;
        const { error } = await supabase
            .from("presupuestos")
            .delete()
            .eq("id", id);

        if (error) throw error;

        // 3. Animación suave de salida y remoción del nodo en el DOM
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            setTimeout(() => card.remove(), 200);
        }

        // 4. Actualizar el contador de tarjetas o recargar si ya no quedan más
        setTimeout(() => {
            if (contenedor && contenedor.querySelectorAll("[id^='card-']").length === 0) {
                if (auth.currentUser) cargarPresupuestos(auth.currentUser.uid);
            } else if (contadorPresupuestos && contenedor) {
                const restantes = contenedor.querySelectorAll("[id^='card-']").length;
                contadorPresupuestos.textContent = `${restantes} ${restantes === 1 ? 'guardado' : 'guardados'}`;
            }
        }, 250);

    } catch (err) {
        console.error("Error al borrar:", err);
        alert("No se pudo eliminar el presupuesto: " + err.message);
    }
};
