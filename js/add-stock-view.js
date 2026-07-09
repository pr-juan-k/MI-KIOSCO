/**
 * Lógica para la vista de "Agregar Stock"
 */

let catSeleccionadaStock = null;
let prodActualesStock = [];

// Iniciar al cargar (asegúrate de llamar esto o incluirlo en el window.onload general)
document.addEventListener('DOMContentLoaded', () => {
    renderizarCategoriasStock();
});

// 1. Renderizar Categorías en FILA (Usando el estilo .cat-pill)
function renderizarCategoriasStock() {
    const row = document.getElementById('gridCategoriasStock');
    row.innerHTML = '';
    
    // Usamos ESTRUCTURA_CATEGORIAS del archivo tienda-productos.js
    Object.keys(ESTRUCTURA_CATEGORIAS).forEach(cat => {
        const btn = document.createElement('div');
        btn.className = 'cat-pill'; // Clase nueva para estilo en fila
        btn.onclick = () => seleccionarCategoriaStock(cat);
        btn.innerHTML = `
            <span class="cat-icon">${ICONOS_CAT[cat] || '📦'}</span>
            <span class="cat-name">${cat}</span>
        `;
        row.appendChild(btn);
    });
}

// 2. Selección y Navegación
function seleccionarCategoriaStock(categoria) {
    catSeleccionadaStock = categoria;
    
    // Ocultar fila principal, mostrar breadcrumb
    document.querySelector('.scroll-container').style.display = 'none';
    
    const bread = document.getElementById('breadcrumbStock');
    bread.style.display = 'block';
    document.getElementById('breadcrumb-cat-stock').textContent = categoria;
    
    // Verificar subcategorías
    const subcategorias = ESTRUCTURA_CATEGORIAS[categoria];
    
    if (subcategorias && subcategorias.length > 0) {
        renderizarSubcategoriasStock(subcategorias);
    } else {
        mostrarTablaStock(categoria, null);
    }
}

function renderizarSubcategoriasStock(listaSubcats) {
    const grid = document.getElementById('gridSubcategoriasStock');
    grid.innerHTML = '';
    grid.style.display = 'grid'; // Las subcategorías las mantenemos en grid (opcional)
    
    listaSubcats.forEach(sub => {
        const btn = document.createElement('div');
        btn.className = 'cat-card'; // Reutilizamos el estilo cuadrado para subcats
        btn.onclick = () => {
            document.getElementById('breadcrumb-separator-stock').style.display = 'inline';
            document.getElementById('breadcrumb-cat-stock').textContent = `${catSeleccionadaStock} > ${sub}`;
            mostrarTablaStock(catSeleccionadaStock, sub);
        };
        
        btn.innerHTML = `
            <span class="cat-icon">📂</span>
            <span class="cat-name">${sub}</span>
        `;
        grid.appendChild(btn);
    });
}

// 3. Función para VOLVER ATRÁS (Resetear vista)
function resetearVistaStock() {
    // Mostrar fila de categorías
    document.querySelector('.scroll-container').style.display = 'block';
    
    // Ocultar resto
    document.getElementById('gridSubcategoriasStock').style.display = 'none';
    document.getElementById('panelTablaStock').style.display = 'none';
    document.getElementById('breadcrumbStock').style.display = 'none';
    document.getElementById('breadcrumb-separator-stock').style.display = 'none';
    
    document.getElementById('inputBusquedaTablaStock').value = '';
}

// 4. Tabla y Lógica de Sumar
function mostrarTablaStock(categoria, subcategoria) {
    document.querySelector('.scroll-container').style.display = 'none';
    document.getElementById('gridSubcategoriasStock').style.display = 'none';
    document.getElementById('panelTablaStock').style.display = 'block';
    
    // Filtrar usando la función global de tienda-productos.js
    prodActualesStock = obtenerProductosPorCategoria(categoria, subcategoria);
    renderizarFilasStock(prodActualesStock);
}

function renderizarFilasStock(datos) {
    const tbody = document.getElementById('tbodyProductosStock');
    tbody.innerHTML = '';

    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay productos.</td></tr>';
        return;
    }

    datos.forEach(p => {
        const tr = document.createElement('tr');
        // ID único para el input basado en el código del producto
        const inputId = `stock-add-${p.codigo}`;
        
        tr.innerHTML = `
            <td><strong>${p.codigo}</strong></td>
            <td>${p.nombre}</td>
            <td>${p.marca}</td>
            <td style="font-weight:bold; color:#2563eb;">${p.stock} u.</td>
            <td>
                <input type="number" id="${inputId}" class="input-qty" min="1" value="0">
            </td>
            <td>
                <button class="btn-add-stock" onclick="sumarStock('${p.codigo}')">
                    &#10133; Agregar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. Acción del botón "Agregar"
function sumarStock(codigoProducto) {
    const input = document.getElementById(`stock-add-${codigoProducto}`);
    const cantidad = parseInt(input.value);
    
    if (!cantidad || cantidad <= 0) {
        alert("Por favor ingrese una cantidad válida mayor a 0");
        return;
    }

    // Buscar producto en la base de datos simulada (tienda-productos.js)
    const producto = PRODUCTOS_TIENDA.find(p => p.codigo === codigoProducto);
    
    if (producto) {
        producto.stock += cantidad; // Actualizar dato
        alert(`¡Stock actualizado! Nuevo total: ${producto.stock}`);
        
        // Refrescar tabla para ver cambios
        input.value = 0; // Resetear input
        // Volver a renderizar solo para actualizar el número visualmente
        filtrarTablaStock(); 
    }
}

// 6. Buscador interno de la tabla
function filtrarTablaStock() {
    const termino = document.getElementById('inputBusquedaTablaStock').value.toLowerCase();
    
    // Si no hay filtro, mostrar toda la selección actual
    let filtrados = prodActualesStock;

    if (termino !== '') {
        filtrados = prodActualesStock.filter(p => 
            p.codigo.toLowerCase().includes(termino) ||
            p.nombre.toLowerCase().includes(termino)
        );
    }
    renderizarFilasStock(filtrados);
}