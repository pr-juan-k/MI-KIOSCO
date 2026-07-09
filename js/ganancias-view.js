/**
 * js/ganancias-view.js
 * Muestra tablas de recaudación mensual con estados de color.
 */

// DATOS SIMULADOS (Enero completo, Febrero en curso)
const DATOS_GANANCIAS = [
    {
        mes: "Enero 2026",
        estado: "cerrado", // Mes completo
        totalMes: 1580000,
        semanas: [
            // Cada semana tiene 7 días + el total semanal calculado
            { dias: [50000, 45000, 60000, 55000, 70000, 80000, 20000] }, // Semana 1
            { dias: [52000, 48000, 62000, 58000, 75000, 85000, 25000] }, // Semana 2
            { dias: [51000, 46000, 61000, 54000, 72000, 82000, 22000] }, // Semana 3
            { dias: [53000, 49000, 63000, 59000, 76000, 88000, 30000] }  // Semana 4
        ]
    },
    {
        mes: "Febrero 2026",
        estado: "abierto", // Mes actual
        totalMes: 385000, // Acumulado hasta hoy
        semanas: [
            // Semana 1 (Pasada - Verde)
            { dias: [60000, 55000, 65000, 60000, 75000, 90000, 30000] }, 
            // Semana 2 (En curso - Verde, Naranja, Rosa)
            { dias: [58000, 52000, 0, 0, 0, 0, 0] }, 
            // Semanas futuras (Rosa - 0)
            { dias: [0, 0, 0, 0, 0, 0, 0] },
            { dias: [0, 0, 0, 0, 0, 0, 0] }
        ]
    }
];

// Configuración para simular "HOY" en la vista (Fila 2, Día 3 de Febrero)
const SIMULACION_HOY = {
    mesIndex: 1, // Febrero
    semanaIndex: 1, // Segunda semana
    diaIndex: 2 // Miércoles (0=Lunes, 1=Martes, 2=Miercoles...)
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarGanancias();
});

function renderizarGanancias() {
    const contenedor = document.getElementById('contenedor-meses-ganancias');
    contenedor.innerHTML = '';

    DATOS_GANANCIAS.forEach((dato, indexMes) => {
        // Calcular totales si no vinieran calculados
        const htmlMes = construirHTMLMes(dato, indexMes);
        contenedor.insertAdjacentHTML('beforeend', htmlMes);
    });
}

function construirHTMLMes(dato, indexMes) {
    let filasHTML = '';
    let totalAcumuladoMes = 0;

    dato.semanas.forEach((semana, indexSemana) => {
        let celdasHTML = '';
        let totalSemana = 0;

        semana.dias.forEach((monto, indexDia) => {
            // Lógica de colores
            let claseEstado = 'status-pink'; // Futuro por defecto
            let montoMostrar = formatearDinero(monto);
            
            // Si es mes pasado (Enero) -> Todo Verde
            if (dato.estado === 'cerrado') {
                claseEstado = 'status-green';
            } 
            // Si es mes actual (Febrero)
            else {
                if (indexSemana < SIMULACION_HOY.semanaIndex) {
                    claseEstado = 'status-green'; // Semanas pasadas
                } else if (indexSemana === SIMULACION_HOY.semanaIndex) {
                    if (indexDia < SIMULACION_HOY.diaIndex) claseEstado = 'status-green'; // Días pasados
                    else if (indexDia === SIMULACION_HOY.diaIndex) {
                        claseEstado = 'status-orange'; // HOY
                        monto = 25400; // Monto simulado de "Hoy hasta el momento"
                        montoMostrar = formatearDinero(monto); 
                    }
                }
            }

            // Click para ver detalle
            const onclickAttr = (monto > 0) ? `onclick="verDetalleDia('${dato.mes}', ${monto})"` : '';

            celdasHTML += `
                <td class="cell-day ${claseEstado}" ${onclickAttr}>
                    <span class="day-number">Día ${indexDia + 1}</span>
                    <span class="day-amount">${montoMostrar}</span>
                </td>
            `;
            
            totalSemana += monto;
        });

        // Columna Total Semanal
        celdasHTML += `<td class="col-total-semana">${formatearDinero(totalSemana)}</td>`;
        
        filasHTML += `<tr>${celdasHTML}</tr>`;
        totalAcumuladoMes += totalSemana;
    });

    // Estructura del Acordeón
    const isOpen = (indexMes === 1) ? 'open' : ''; // Abrir Febrero por defecto
    
    return `
        <div class="mes-accordion">
            <div class="mes-header" onclick="toggleMes(this)">
                <span class="mes-titulo">${dato.mes}</span>
                <span class="mes-total">Total: ${formatearDinero(totalAcumuladoMes)}</span>
            </div>
            <div class="mes-content ${isOpen}">
                <table class="tabla-ganancias">
                    <thead>
                        <tr>
                            <th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasHTML}
                    </tbody>
                </table>
                <div class="footer-mes">
                    <strong>TOTAL MENSUAL RECAUDADO</strong>
                    <strong>${formatearDinero(totalAcumuladoMes)}</strong>
                </div>
            </div>
        </div>
    `;
}

// Funcionalidad del Acordeón
function toggleMes(header) {
    const content = header.nextElementSibling;
    // Cerrar otros (opcional, si quieres que solo uno esté abierto)
    // document.querySelectorAll('.mes-content').forEach(c => c.classList.remove('open'));
    
    content.classList.toggle('open');
}

// Funcionalidad del Modal de Detalle
function verDetalleDia(mes, total) {
    const modal = document.getElementById('modalDetalleDia');
    
    // Simular desglose (70% efectivo, 30% transferencia)
    const efectivo = total * 0.70;
    const transf = total * 0.30;

    document.getElementById('modal-titulo-dia').innerText = `Detalle - ${mes}`;
    document.getElementById('modal-efectivo').innerText = formatearDinero(efectivo);
    document.getElementById('modal-transferencia').innerText = formatearDinero(transf);
    document.getElementById('modal-total').innerText = formatearDinero(total);

    modal.style.display = 'flex';
}

function cerrarModalGanancias() {
    document.getElementById('modalDetalleDia').style.display = 'none';
}

// Utilidad
function formatearDinero(valor) {
    return '$' + valor.toLocaleString('es-AR', { minimumFractionDigits: 0 });
}