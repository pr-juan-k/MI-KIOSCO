// Agrega esto al principio del archivo admin-productos-view.js
window.onload = function() {
    renderizarCategorias(); // Esto dibuja las cajitas de Regaleria, Farmacia, etc.
};



// Variables de estado
let categoriaSeleccionada = null;
let productosActualesTabla = [];

document.addEventListener('DOMContentLoaded', () => {
    renderizarCategorias();
});

/* -----------------------------------------------------
   1. BUSCADOR GLOBAL (Resultado en filas al escribir)
   ----------------------------------------------------- */
function manejarBusquedaGlobal() {
    const input = document.getElementById('inputBusquedaGlobal');
    const contenedor = document.getElementById('resultadosGlobales');
    const termino = input.value;

    contenedor.innerHTML = ''; // Limpiar

    if (termino.length < 2) return; // Esperar al menos 2 letras

    const resultados = buscarProductosTiendaGlobal(termino);

    if (resultados.length === 0) {
        contenedor.innerHTML = '<div style="padding:10px; color:#666;">No se encontraron productos.</div>';
        return;
    }

    resultados.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'result-card';
        div.innerHTML = `
            <div class="result-info">
                <strong>${prod.nombre}</strong>
                <span>COD: ${prod.codigo}</span>
                <span>Marca: ${prod.marca}</span>
                <span>${prod.categoria} ${prod.subcategoria ? '> ' + prod.subcategoria : ''}</span>
            </div>
            <div class="result-price">${formatearPrecio(prod.precio)}</div>
        `;
        contenedor.appendChild(div);
    });
}

/* -----------------------------------------------------
   2. LÓGICA DE CATEGORÍAS Y SUBCATEGORÍAS
   ----------------------------------------------------- */

// Iconos simulados para las categorías
const ICONOS_CAT = {
    'Regaleria': '🎁', 'Farmacia': '💊', 'Panaderia': '🥖', 'Bazares': '🍽️',
    'Jugueteria': '🧸', 'Indumentaria': '👕', 'Golosinas': '🍬', 'Gas Envasado': '🔥',
    'Bebidas': '🥤', 'Cotillon': '🎉', 'Forrajeria': '🐾', 'Embutidos': '🌭',
    'Lacteos': '🧀', 'Ropa Intima': '👙', 'Merceria': '🧵', 'Escolar': '✏️',
    'Almacen': '🥫', 'Cigarrillos': '🚬'
};

function renderizarCategorias() {
    const grid = document.getElementById('gridCategorias');
    grid.innerHTML = '';
    
    // Obtener claves del objeto ESTRUCTURA_CATEGORIAS
    Object.keys(ESTRUCTURA_CATEGORIAS).forEach(cat => {
        const btn = document.createElement('div');
        btn.className = 'cat-card';
        btn.onclick = () => seleccionarCategoria(cat);
        btn.innerHTML = `
            <span class="cat-icon">${ICONOS_CAT[cat] || '📦'}</span>
            <span class="cat-name">${cat}</span>
        `;
        grid.appendChild(btn);
    });
}

function seleccionarCategoria(categoria) {
    categoriaSeleccionada = categoria;
    
    // UI Updates
    document.getElementById('gridCategorias').style.display = 'none';
    document.getElementById('breadcrumb').style.display = 'block';
    document.getElementById('breadcrumb-cat').textContent = categoria;
    
    // Verificar si tiene subcategorías definidas
    const subcategorias = ESTRUCTURA_CATEGORIAS[categoria];
    
    if (subcategorias && subcategorias.length > 0) {
        renderizarSubcategorias(subcategorias);
    } else {
        // Si no tuviera subcategorías, mostramos productos directos (caso raro según tu lista)
        mostrarTablaProductos(categoria, null);
    }
}

function renderizarSubcategorias(listaSubcats) {
    const gridSub = document.getElementById('gridSubcategorias');
    gridSub.innerHTML = '';
    gridSub.style.display = 'grid'; // Mostrar grid de subcategorías
    
    listaSubcats.forEach(sub => {
        const btn = document.createElement('div');
        btn.className = 'cat-card';
        // Estilo visual ligeramente distinto para subcategorías si se desea
        btn.style.borderColor = '#e2e8f0'; 
        
        btn.onclick = () => {
            document.getElementById('breadcrumb-separator').style.display = 'inline';
            document.getElementById('breadcrumb-cat').textContent = `${categoriaSeleccionada} > ${sub}`;
            mostrarTablaProductos(categoriaSeleccionada, sub);
        };
        
        btn.innerHTML = `
            <span class="cat-icon">📂</span>
            <span class="cat-name">${sub}</span>
        `;
        gridSub.appendChild(btn);
    });
}

function resetearVistaCategorias() {
    // Ocultar todo y volver al inicio
    document.getElementById('gridCategorias').style.display = 'grid';
    document.getElementById('gridSubcategorias').style.display = 'none';
    document.getElementById('panelTablaProductos').style.display = 'none';
    document.getElementById('breadcrumb').style.display = 'none';
    document.getElementById('breadcrumb-separator').style.display = 'none';
    
    // Limpiar buscador de tabla
    document.getElementById('inputBusquedaTabla').value = '';
}

/* -----------------------------------------------------
   3. TABLA DE PRODUCTOS
   ----------------------------------------------------- */

function mostrarTablaProductos(categoria, subcategoria) {
    // Ocultar grids de selección
    document.getElementById('gridCategorias').style.display = 'none';
    document.getElementById('gridSubcategorias').style.display = 'none';
    
    // Mostrar panel de tabla
    document.getElementById('panelTablaProductos').style.display = 'block';
    
    // Filtrar datos
    productosActualesTabla = obtenerProductosPorCategoria(categoria, subcategoria);
    
    renderizarFilasTabla(productosActualesTabla);
}

function renderizarFilasTabla(datos) {
    const tbody = document.getElementById('tbodyProductos');
    tbody.innerHTML = '';

    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay productos en esta sección.</td></tr>';
        return;
    }

    datos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.codigo}</strong></td>
            <td>${p.marca}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>${p.subcategoria || '-'}</td>
            <td>${formatearPrecio(p.precio)}</td>
            <td>${p.stock}</td>
            <td>
                <button style="cursor:pointer; background:none; border:none;" title="Editar">✏️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Filtro específico dentro de la tabla mostrada
function filtrarTablaActual() {
    const termino = document.getElementById('inputBusquedaTabla').value.toLowerCase();
    
    if (termino === '') {
        renderizarFilasTabla(productosActualesTabla);
        return;
    }
    
    const filtrados = productosActualesTabla.filter(p => 
        p.codigo.toLowerCase().includes(termino) ||
        p.nombre.toLowerCase().includes(termino) ||
        p.marca.toLowerCase().includes(termino)
    );
    
    renderizarFilasTabla(filtrados);
}