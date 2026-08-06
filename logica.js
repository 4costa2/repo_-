const proporciones_mezcla_hormigon_base = { arena: 4, ripio: 4, cemento: 2 };
const proporciones_mezcla_mortero_base = { arena: 7, cemento: 2 };

function calcularMateriales(volumen, proporciones, precios,TamanobolsaCemento,tamanoBaldes) {
    const volumen_con_perdida = volumen*1.05;
    const sumaPartes =
    proporciones.arena + proporciones.ripio + proporciones.cemento;

    const volumenes = {
        arena: (proporciones.arena / sumaPartes) * volumen_con_perdida,
        ripio: (proporciones.ripio / sumaPartes) * volumen_con_perdida,
    };
    const volumen_un_balde = tamanoBaldes / 1000;//el 1000 es para pasar a m3 los lts del balde 1m3 es aprox 1000 l
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
    try{
        const leerInput = (id, valorPorDefecto = 0) => {
            const elemento = document.getElementById(id);
            if (!elemento) {
                alert(`¡Error detectado! Falta el input con el id="${id}" en tu archivo HTML. Revisá que no se haya borrado o escrito distinto.`);
                throw new Error(`Falta el elemento HTML con id: ${id}`);
            }
            return elemento.value ? Number(elemento.value) : valorPorDefecto;
        };
    let TamanobolsaCemento = Number( document.getElementById("tamanoBolsa").value);
    let tamanoBaldes = Number(document.getElementById("tamanoBalde").value);
    let largo = Number(document.getElementById("largo").value);
    let ancho = Number(document.getElementById("ancho").value);
    let profundidad = Number(document.getElementById("altura").value) / 100;
    let presupuesto=Number(document.getElementById("Presupuesto_2").value)

    // para cuando necesitemos calcular ceramicos
    let area = largo * ancho;
    let volumen = area * profundidad;

    const proporciones = {
        arena: Number(document.getElementById("prop_arena").value||4),
        ripio: Number(document.getElementById("prop_ripio").value||4),
        cemento: Number(document.getElementById("prop_cemento").value||2),
    };

    let precios = {
        arena: Number(document.getElementById("precio_arena").value),
        ripio: Number(document.getElementById("precio_ripio").value),
        cemento: Number(document.getElementById("precio_cemento").value),
    };

    const resultado = calcularMateriales(volumen, proporciones, precios,TamanobolsaCemento,tamanoBaldes);
    let diferencia = null; 
    if (presupuesto>0){
        diferencia= presupuesto-resultado.total;
    }

    document.getElementById("resultado_1").innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-zinc-300">
        <div><span class="text-zinc-500">Área:</span> ${(area).toFixed(2)} m²</div>
        <div><span class="text-zinc-500">Volumen:</span> ${volumen.toFixed(2)} m³</div>
        <div><span class="text-zinc-500">Arena:</span> ${Math.ceil(resultado.volumenes.arena)} m³</div>
        <div><span class="text-zinc-500">Ripio:</span> ${Math.ceil(resultado.volumenes.ripio)} m³</div>
        <div><span class="text-zinc-500">Cemento:</span> ${resultado.bolsas_recomendadas} bolsas</div>
        <div class="col-span-2 font-semibold text-emerald-400 pt-2 border-t border-zinc-700">Costo total: $${resultado.total.toFixed(2)}</div>
        </div>
        ${presupuesto ? `<div class="mt-2 pt-2 border-t border-zinc-700 text-xs"><span class="text-zinc-500">Presupuesto:</span> $${presupuesto.toFixed(2)}<br><span class="${diferencia >= 0 ? "text-emerald-400" : "text-rose-400"} font-semibold">${diferencia >= 0 ? "Sobra" : "Falta"}: $${Math.abs(diferencia).toFixed(2)}</span></div>` : ""}
        `;}
        catch(error){
            console.error("Error lógico:", error);
        alert("Ocurrió un error en el cálculo. Revisa la consola o verifica los datos ingresados.");
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
