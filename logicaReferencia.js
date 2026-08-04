

let TamanobolsaCemento = Number(document.getElementById("tamañoBolsa").value);
let tamanoBaldes = (TamañobolsaCemento = Number(
    document.getElementById("tamañoBalde").value,
));
const cantidad_baldes_mcubi = { arena: 145, ripio: 140, cemento: 143 };
const proporciones_mezcla_hormigon_base = { arena: 4, ripio: 4, cemento: 2 };
//let VOLUMEN_BOLSA_CEMENTO = 0.0398
let VOLUMEN_BOLSA_CEMENTO = TamanobolsaCemento / tamanoBaldes;

function calcularMateriales(volumen, proporciones, precios) {
    const sumaPartes =
        proporciones.arena + proporciones.ripio + proporciones.cemento;

    const volumenes = {
        arena: (proporciones.arena / sumaPartes) * volumen,
        ripio: (proporciones.ripio / sumaPartes) * volumen,
        cemento: (proporciones.cemento / sumaPartes) * volumen,
    };

    const baldes = {
        arena: volumenes.arena,
        ripio: volumenes.ripio,
        cemento: Math.ceil(volumenes.cemento / VOLUMEN_BOLSA_CEMENTO),
    };

    const costos = {
        arena: volumenes.arena * precios.arena,
        ripio: volumenes.ripio * precios.ripio,
        cemento: baldes.cemento * precios.cemento,
    };

    const total = costos.arena + costos.ripio + costos.cemento;

    return { volumenes, baldes, costos, total };
}

//

function calculo_contrapiso() {
    let largo = Number(document.getElementById("largo").value);
    let ancho = Number(document.getElementById("ancho").value);
    let profundidad = Number(document.getElementById("altura").value) / 100;
    let presupuesto =
        Number(document.getElementById("Presupuesto_2").value) || 0;

    let area = largo * ancho;
    let volumen = area * profundidad;

    const proporciones = {
        arena: Number(document.getElementById("prop_arena").value),
        ripio: Number(document.getElementById("prop_ripio").value),
        cemento: Number(document.getElementById("prop_cemento").value),
    };

    const precios = {
        arena: Number(document.getElementById("precio_arena").value),
        ripio: Number(document.getElementById("precio_ripio").value),
        cemento: Number(document.getElementById("precio_cemento").value),
    };

    const resultado = calcularMateriales(volumen, proporciones, precios);
    const diferencia = presupuesto ? presupuesto - resultado.total : null;

    document.getElementById("resultado_1").innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-zinc-300">
          <div><span class="text-zinc-500">Área:</span> ${area.toFixed(2)} m²</div>
          <div><span class="text-zinc-500">Volumen:</span> ${volumen.toFixed(2)} m³</div>
          <div><span class="text-zinc-500">Arena:</span> ${resultado.volumenes.arena.toFixed(2)} m³</div>
          <div><span class="text-zinc-500">Ripio:</span> ${resultado.volumenes.ripio.toFixed(2)} m³</div>
          <div><span class="text-zinc-500">Cemento:</span> ${resultado.baldes.cemento} bolsas</div>
          <div class="col-span-2 font-semibold text-emerald-400 pt-2 border-t border-zinc-700">Costo total: $${resultado.total.toFixed(2)}</div>
        </div>
        ${presupuesto ? `<div class="mt-2 pt-2 border-t border-zinc-700 text-xs"><span class="text-zinc-500">Presupuesto:</span> $${presupuesto.toFixed(2)}<br><span class="${diferencia >= 0 ? "text-emerald-400" : "text-rose-400"} font-semibold">${diferencia >= 0 ? "Sobra" : "Falta"}: $${Math.abs(diferencia).toFixed(2)}</span></div>` : ""}
      `;
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

function reinicio() {
    document.getElementById("form_rectangulo").querySelector("form").reset();
    document
        .getElementById("form_proporciones")
        .querySelector("input#Presupuesto_2").value = "";
    document
        .getElementById("form_proporciones")
        .querySelector("input#prop_arena").value = "3";
    document
        .getElementById("form_proporciones")
        .querySelector("input#prop_ripio").value = "3";
    document
        .getElementById("form_proporciones")
        .querySelector("input#prop_cemento").value = "1";
    document
        .getElementById("form_proporciones")
        .classList.add("max-h-0", "opacity-0");
    document
        .getElementById("form_proporciones")
        .classList.remove("max-h-[1000px]", "opacity-100");
    document.getElementById("resultado_1").innerHTML = "";
}