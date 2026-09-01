document.addEventListener("DOMContentLoaded", () => {
    C_mostrarProporcionesActuales();
});

if (!localStorage.getItem("C_proporciones")) {
    localStorage.setItem(
        "C_proporciones",
        JSON.stringify({
            C_arena: 4,
            C_ripio: 4,
            C_cemento: 2,
        })
    );
}

function C_ajustarProporciones() {
    let C_proporciones = {
        C_arena: Number(document.getElementById("arena").value) || 4,
        C_ripio: Number(document.getElementById("ripio").value) || 4,
        C_cemento: Number(document.getElementById("cemento").value) || 2
    };

    localStorage.setItem("C_proporciones", JSON.stringify(C_proporciones));
    C_mostrarProporcionesActuales();

    alert("Proporciones guardadas correctamente");
    window.location.href = "contrapiso.html";
}

function C_calcularMateriales(
    C_volumen,
    C_precios,
    C_TamanobolsaCemento,
    C_tamanoBaldes,
) {
    let C_proporciones = JSON.parse(localStorage.getItem("C_proporciones"));
    const C_volumen_con_perdida = C_volumen * 1.05;
    const C_sumaPartes =
        C_proporciones.C_arena + C_proporciones.C_ripio + C_proporciones.C_cemento;

    const C_volumenes = {
        C_arena: Math.ceil(
            (C_proporciones.C_arena / C_sumaPartes) * C_volumen_con_perdida,
        ),
        C_ripio: Math.ceil(
            (C_proporciones.C_ripio / C_sumaPartes) * C_volumen_con_perdida,
        ),
    };
    const C_volumen_un_balde = C_tamanoBaldes / 1000; //el 1000 es para pasar a m3 los lts del balde 1m3 es aprox 1000 l
    const C_volumen_maquinada = C_sumaPartes * C_volumen_un_balde;
    const C_cantidad_maquinadas = C_volumen_con_perdida / C_volumen_maquinada;
    const C_baldes_cemento_totales = C_cantidad_maquinadas * C_proporciones.C_cemento;
    const C_baldes_por_bolsa = C_TamanobolsaCemento / C_tamanoBaldes;
    const C_bolsas_exactas = C_baldes_cemento_totales / C_baldes_por_bolsa;
    const C_bolsas_recomendadas = Math.ceil(C_bolsas_exactas);

    const C_costos = {
        C_arena: C_volumenes.C_arena * C_precios.C_arena,
        C_ripio: C_volumenes.C_ripio * C_precios.C_ripio,
        C_cemento: C_bolsas_recomendadas * C_precios.C_cemento,
    };

    const C_total = C_costos.C_arena + C_costos.C_ripio + C_costos.C_cemento;

    return { C_volumenes, C_bolsas_exactas, C_bolsas_recomendadas, C_costos, C_total };
}

function C_calculo_contrapiso(event) {
    if (event) {
        event.preventDefault();
    }
    try {
        const leerInput = (id, valorPorDefecto = 0) => {
            const elemento = document.getElementById(id);
            if (!elemento) {
                alert(
                    `¡Error detectado! Falta el input con el id="${id}" en tu archivo HTML. Revisá que no se haya borrado o escrito distinto.`,
                );
                throw new Error(`Falta el elemento HTML con id: ${id}`);
            }
            return elemento.value ? Number(elemento.value) : valorPorDefecto;
        };
        let C_TamanobolsaCemento = Number(
            document.getElementById("tamanoBolsa").value,
        );
        let C_tamanoBaldes = Number(document.getElementById("tamanoBalde").value);
        let C_largo = Number(document.getElementById("largo").value);
        let C_ancho = Number(document.getElementById("ancho").value);
        let C_profundidad = Number(document.getElementById("altura").value) / 100;

        // para cuando necesitemos calcular ceramicos
        let C_area = C_largo * C_ancho;
        let C_volumen = C_area * C_profundidad;

        let C_precios = {
            C_arena: Number(document.getElementById("precio_arena").value),
            C_ripio: Number(document.getElementById("precio_ripio").value),
            C_cemento: Number(document.getElementById("precio_cemento").value),
        };

        const C_resultado = C_calcularMateriales(
            C_volumen,
            C_precios,
            C_TamanobolsaCemento,
            C_tamanoBaldes,
        );

        let C_diferencia = null;
        if (C_resultado.C_total.toFixed(2) > 0) {
            C_diferencia = `$ ${C_resultado.C_total.toLocaleString('es-AR')}`;
        } else if (C_resultado.C_total.toFixed(2) == 0) {
            C_diferencia = "No has ingresado costo de materiales";
        }

        const resDiv = document.getElementById("resultado_1");
        resDiv.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                    <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white">Resultado del Presupuesto</h3>
                </div>
                <span class="text-[11px] font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">Estimación</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div class="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
                    <span class="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Área total</span>
                    <span class="text-base sm:text-lg font-bold text-white">${C_area.toFixed(2)} <span class="text-xs font-normal text-zinc-400">m²</span></span>
                </div>
                <div class="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
                    <span class="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Volumen</span>
                    <span class="text-base sm:text-lg font-bold text-white">${C_volumen.toFixed(2)} <span class="text-xs font-normal text-zinc-400">m³</span></span>
                </div>
                <div class="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3 col-span-2 sm:col-span-1">
                    <span class="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Bolsas Cemento</span>
                    <span class="text-base sm:text-lg font-bold text-sky-400">${C_resultado.C_bolsas_recomendadas} <span class="text-xs font-normal text-zinc-400">bolsas</span></span>
                </div>
                <div class="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
                    <span class="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Arena necesaria</span>
                    <span class="text-base sm:text-lg font-bold text-zinc-200">${C_resultado.C_volumenes.C_arena} <span class="text-xs font-normal text-zinc-400">m³</span></span>
                </div>
                <div class="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
                    <span class="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Ripio necesario</span>
                    <span class="text-base sm:text-lg font-bold text-zinc-200">${C_resultado.C_volumenes.C_ripio} <span class="text-xs font-normal text-zinc-400">m³</span></span>
                </div>
            </div>

            <div class="flex items-center justify-between p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <span class="text-xs sm:text-sm font-medium text-zinc-300">Costo total estimado:</span>
                <span class="text-base sm:text-lg font-bold text-sky-400">${C_diferencia}</span>
            </div>
        </div>
        `;

        resDiv.classList.remove("hidden");
        resDiv.classList.remove("animate-fade-in");
        void resDiv.offsetWidth; // Forzar reflow para reiniciar animación
        resDiv.classList.add("animate-fade-in");

    } catch (error) {
        console.error("Error lógico:", error);
        alert(
            "Ocurrió un error en el cálculo. Revisa la consola o verifica los datos ingresados.",
        );
    }
}

function C_mostrarProporciones() {
    const propDiv = document.getElementById("form_proporciones");
    if (propDiv.classList.contains("max-h-0")) {
        propDiv.classList.remove("max-h-0", "opacity-0");
        propDiv.classList.add("max-h-[1000px]", "opacity-100");
    } else {
        propDiv.classList.add("max-h-0", "opacity-0");
        propDiv.classList.remove("max-h-[1000px]", "opacity-100");
    }
}

function C_mostrarProporcionesActuales() {
    const C_proporciones = JSON.parse(localStorage.getItem("C_proporciones")) || {
        C_arena: 4,
        C_ripio: 4,
        C_cemento: 2
    };
    if (document.getElementById("arenaDato")) {
        document.getElementById("arenaDato").textContent = C_proporciones.C_arena;
        document.getElementById("ripioDato").textContent = C_proporciones.C_ripio;
        document.getElementById("cementoDato").textContent = C_proporciones.C_cemento;
    }
}

function C_reinicio() {
    document.getElementById("precio_arena").value = "";
    document.getElementById("precio_ripio").value = "";
    document.getElementById("precio_cemento").value = "";
    document.getElementById("tamanoBalde").value = "";
    document.getElementById("tamanoBolsa").value = "";
    document.getElementById("largo").value = "";
    document.getElementById("ancho").value = "";
    document.getElementById("altura").value = "";

    const resDiv = document.getElementById("resultado_1");
    if (resDiv) {
        resDiv.classList.add("hidden");
        resDiv.innerHTML = "";
    }
}
