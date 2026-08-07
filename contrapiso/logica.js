document.addEventListener("DOMContentLoaded", () => {
    mostrarProporcionesActuales();
});

if (!localStorage.getItem("proporciones")) {
    localStorage.setItem(
        "proporciones",
        JSON.stringify({
            arena: 4,
            ripio: 4,
            cemento: 2,
        })
    );
}

function ajustarProporciones() {
    let proporciones = {
        arena: Number(document.getElementById("arena").value) || 4,
        ripio: Number(document.getElementById("ripio").value) || 4,
        cemento: Number(document.getElementById("cemento").value) || 2
    };

    localStorage.setItem("proporciones", JSON.stringify(proporciones))  
    
    mostrarProporcionesActuales()
}




function calcularMateriales(
    volumen,
    precios,
    TamanobolsaCemento,
    tamanoBaldes,
) {
    let proporciones= JSON.parse(localStorage.getItem("proporciones"))
    const volumen_con_perdida = volumen * 1.05;
    const sumaPartes =
        proporciones.arena + proporciones.ripio + proporciones.cemento;

    const volumenes = {
        arena: Math.ceil(
            (proporciones.arena / sumaPartes) * volumen_con_perdida,
        ),
        ripio: Math.ceil(
            (proporciones.ripio / sumaPartes) * volumen_con_perdida,
        ),
    };
    const volumen_un_balde = tamanoBaldes / 1000; //el 1000 es para pasar a m3 los lts del balde 1m3 es aprox 1000 l
    const volumen_maquinada = sumaPartes * volumen_un_balde;
    const cantidad_maquinadas = volumen_con_perdida / volumen_maquinada;
    const baldes_cemento_totales = cantidad_maquinadas * proporciones.cemento;
    const baldes_por_bolsa = TamanobolsaCemento / tamanoBaldes;
    const bolsas_exactas = baldes_cemento_totales / baldes_por_bolsa;
    const bolsas_recomendadas = Math.ceil(bolsas_exactas);

    const costos = {
        arena: volumenes.arena * precios.arena,
        ripio: volumenes.ripio * precios.ripio,
        cemento: bolsas_recomendadas * precios.cemento,
    };

    const total = costos.arena + costos.ripio + costos.cemento;

    return { volumenes, bolsas_exactas, bolsas_recomendadas, costos, total };
}

function calculo_contrapiso(event) {
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
        let TamanobolsaCemento = Number(
            document.getElementById("tamanoBolsa").value,
        );
        let tamanoBaldes = Number(document.getElementById("tamanoBalde").value);
        let largo = Number(document.getElementById("largo").value);
        let ancho = Number(document.getElementById("ancho").value);
        let profundidad = Number(document.getElementById("altura").value) / 100;

        // para cuando necesitemos calcular ceramicos
        let area = largo * ancho;
        let volumen = area * profundidad;

        let precios = {
            arena: Number(document.getElementById("precio_arena").value),
            ripio: Number(document.getElementById("precio_ripio").value),
            cemento: Number(document.getElementById("precio_cemento").value),
        };

        const resultado = calcularMateriales(
            volumen,
            precios,
            TamanobolsaCemento,
            tamanoBaldes,
        );

        let diferencia = null;
        if (resultado.total.toFixed(2) > 0) {
            diferencia = `$ ${resultado.total}`;
        } else if (resultado.total.toFixed(2) == 0) {
            diferencia = "No has ingresado el costo de ningun material";
        }

        document.getElementById("resultado_1").innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-zinc-300">
        <div><span class="text-zinc-500">Área: </span>${area.toFixed(2)} m²</div>
        <div><span class="text-zinc-500">Volumen:</span> ${volumen.toFixed(2)} m³</div>
        <div><span class="text-zinc-500">Arena:</span> ${resultado.volumenes.arena} m³</div>
        <div><span class="text-zinc-500">Ripio:</span> ${resultado.volumenes.ripio} m³</div>
        <div><span class="text-zinc-500">Cemento:</span> ${resultado.bolsas_recomendadas} bolsas</div>
        <div class="col-span-2 font-semibold text-emerald-400 pt-2 border-t border-zinc-700">Costo total: ${diferencia}</div>
        </div>
        `;
    } catch (error) {
        console.error("Error lógico:", error);
        alert(
            "Ocurrió un error en el cálculo. Revisa la consola o verifica los datos ingresados.",
        );
    }
}
function mostrarProporciones() {
    const propDiv = document.getElementById("form_proporciones");
    if (propDiv.classList.contains("max-h-0")) {
        propDiv.classList.remove("max-h-0", "opacity-0");
        propDiv.classList.add("max-h-[1000px]", "opacity-100");
    } else {
        propDiv.classList.add("max-h-0", "opacity-0");
        propDiv.classList.remove("max-h-[1000px]", "opacity-100");
    }
}

function mostrarProporcionesActuales(){
    const proporciones = JSON.parse(localStorage.getItem("proporciones")) || {
        arena: 4,
        ripio: 4,
        cemento:2
    };

    document.getElementById("arenaDato").textContent = proporciones.arena
    document.getElementById("ripioDato").textContent = proporciones.ripio
    document.getElementById("cementoDato").textContent = proporciones.cemento
}

function reinicio(){
    document.getElementById("precio_arena").value=""
    document.getElementById("precio_ripio").value=""
    document.getElementById("precio_cemento").value=""
    document.getElementById("tamanoBalde").value=""
    document.getElementById("tamanoBolsa").value=""
    document.getElementById("largo").value=""
    document.getElementById("ancho").value=""
    document.getElementById("altura").value=""
}