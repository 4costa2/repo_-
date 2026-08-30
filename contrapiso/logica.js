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

    localStorage.setItem("C_proporciones", JSON.stringify(C_proporciones))  
    
    C_mostrarProporcionesActuales()
}




function C_calcularMateriales(
    C_volumen,
    C_precios,
    C_TamanobolsaCemento,
    C_tamanoBaldes,
) {
    let C_proporciones= JSON.parse(localStorage.getItem("C_proporciones"))
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
            C_diferencia = `$ ${C_resultado.C_total}`;
        } else if (C_resultado.C_total.toFixed(2) == 0) {
            C_diferencia = "No has ingresado el costo de ningun material";
        }

        document.getElementById("resultado_1").innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-zinc-300">
        <div><span class="text-zinc-500">Área: </span>${C_area.toFixed(2)} m²</div>
        <div><span class="text-zinc-500">Volumen:</span> ${C_volumen.toFixed(2)} m³</div>
        <div><span class="text-zinc-500">Arena:</span> ${C_resultado.C_volumenes.C_arena} m³</div>
        <div><span class="text-zinc-500">Ripio:</span> ${C_resultado.C_volumenes.C_ripio} m³</div>
        <div><span class="text-zinc-500">Cemento:</span> ${C_resultado.C_bolsas_recomendadas} bolsas</div>
        <div class="col-span-2 font-semibold text-emerald-400 pt-2 border-t border-zinc-700">Costo total: ${C_diferencia}</div>
        </div>
        `;
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

function C_mostrarProporcionesActuales(){
    const C_proporciones = JSON.parse(localStorage.getItem("C_proporciones")) || {
        C_arena: 4,
        C_ripio: 4,
        C_cemento:2
    };
    if (document.getElementById("arenaDato")) {
    document.getElementById("arenaDato").textContent = C_proporciones.C_arena
    document.getElementById("ripioDato").textContent = C_proporciones.C_ripio
    document.getElementById("cementoDato").textContent = C_proporciones.C_cemento
    }
}

function C_reinicio(){
    document.getElementById("precio_arena").value=""
    document.getElementById("precio_ripio").value=""
    document.getElementById("precio_cemento").value=""
    document.getElementById("tamanoBalde").value=""
    document.getElementById("tamanoBolsa").value=""
    document.getElementById("largo").value=""
    document.getElementById("ancho").value=""
    document.getElementById("altura").value=""
}