const proporciones_mezcla_hormigon_base = { arena: 4, ripio: 4, cemento: 2 };
const proporciones_mezcla_mortero_base = { arena: 7, cemento: 2 };

function calcularMateriales(volumen, proporciones, precios,TamanobolsaCemento) {
    volumen_con_perdida = volumen*1.05;
    const sumaPartes =
    proporciones.arena + proporciones.ripio + proporciones.cemento;

    const volumenes = {
        arena: (proporciones.arena / sumaPartes) * volumen,
        ripio: (proporciones.ripio / sumaPartes) * volumen,
    };
    const volumen_un_balde = tamanoBaldes / 1000;//el 1000 es para pasar a m3 los lts del balde 1m3 es aprox 1000 l
    const volumen_maquinada = sumaPartes * volumen_un_balde;
    const cantidad_maquinadas = volumen_con_perdida / volumen_maquinada;
    const baldes_cemento_totales = cantidad_maquinadas * proporciones.cemento;
    const baldes_por_bolsa = TamanobolsaCemento / tamanoBaldes;
    const bolsas_exactas = baldes_cemento_totales / baldes_por_bolsa;
    const bolsas_recomendadas = Math.ceil(bolsas_exactas);

    const costos = {
        arena: volumenes.arena * sumaPartes.arena,
        ripio: volumenes.ripio * sumaPartes.ripio,
        cemento: bolsas_recomendadas * precios.cemento,
    };

    const total = costos.arena + costos.ripio + costos.cemento;

    return { volumenes, bolsas_exactas, bolsas_recomendadas, costos, total };
}

function calculo_contrapiso() {
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

    const proporciones = {
        arena: Number(document.getElementById("prop_arena").value),
        ripio: Number(document.getElementById("prop_ripio").value),
        cemento: Number(document.getElementById("prop_cemento").value),
    };

    let precios = {
        arena: Number(document.getElementById("precio_arena").value),
        ripio: Number(document.getElementById("precio_ripio").value),
        cemento: Number(document.getElementById("precio_cemento").value),
    };

    const resultado = calcularMateriales(volumen, proporciones, precios,TamanobolsaCemento);
    const diferencia = presupuesto ? presupuesto - resultado.total : null; // revisar

    document.getElementById("resultado_1").innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-zinc-300">
          <div><span class="text-zinc-500">Área:</span> ${area.ceil()} m²</div>
          <div><span class="text-zinc-500">Volumen:</span> ${volumen.ceil()} m³</div>
          <div><span class="text-zinc-500">Arena:</span> ${resultado.volumenes.arena.ceil()} m³</div>
          <div><span class="text-zinc-500">Ripio:</span> ${resultado.volumenes.ripio.ceil()} m³</div>
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
