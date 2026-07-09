/**
 * MI DRUGSTORE - Sistema de Gestion
 * Modulo de Administrador
 */

// Productos cargados en esta sesion
var productosCargadosSesion = [];

// Subcategorias por categoria
var SUBCATEGORIAS = {
    'Regaleria': ['Perfumes', 'Maquillaje'],
    'Bazares': ['Tupper', 'Vasos', 'Otros'],
    'Indumentaria': ['Nino', 'Adulto'],
    'Bebidas': ['Con Alcohol', 'Sin Alcohol'],
    'Embutidos': ['seccion', 'seccion']
};


document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    mostrarFecha();
    cargarNombreUsuario();
    actualizarEstadisticas();
});

function verificarSesion() {
    var usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
    if (!usuarioLogueado) {
        window.location.href = 'index.html';
        return;
    }
    if (usuarioLogueado === 'empleado') {
        window.location.href = 'empleado.html';
        return;
    }
}

function mostrarFecha() {
    var fechaElement = document.getElementById('fechaActual');
    var opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    var fecha = new Date().toLocaleDateString('es-ES', opciones);
    fechaElement.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

function cargarNombreUsuario() {
    var nombreUsuario = sessionStorage.getItem('nombreUsuario');
    var nombreElement = document.getElementById('nombreUsuario');
    if (nombreUsuario) {
        nombreElement.textContent = nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1);
    }
}

function actualizarEstadisticas() {
    if (typeof PRODUCTOS !== 'undefined') {
        document.getElementById('statProductos').textContent = PRODUCTOS.length;
        var stockBajo = 0;
        for (var j = 0; j < PRODUCTOS.length; j++) {
            if (PRODUCTOS[j].stock !== undefined && PRODUCTOS[j].stock < 10) {
                stockBajo++;
            }
        }
        document.getElementById('statStockBajo').textContent = stockBajo;
    }
}

function cerrarSesionAdmin() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ========================================
// NAVEGACION ENTRE SECCIONES ADMIN
// ========================================

var titulosSecciones = {
    'inicio': 'Panel General',
    'cargar-producto': 'Cargar Nuevo Producto',
    'edit-productos': 'Edit Productos',  // <--- AGREGA ESTA LÍNEA
    'agregar-stock': 'Gestión de Inventario',
    'ganancias': 'Reporte de Ganancias',
    //'inventario': 'Control de Stock',
    //'empleados': 'Gestión de Personal',
    //'configuracion': 'Configuración del Sistema'
};

var idsSecciones = {
    'inicio': 'seccionAdminInicio',
    'cargar-producto': 'seccionCargarProducto', // (o como se llame tu div de cargar)
    'agregar-stock': 'agregar-stock',
    'edit-productos': 'edit-productos',          // <--- AGREGA ESTA LÍNEA (clave : id_del_div_html)
    'ganancias': 'seccionGanancias',
    //'inventario': 'seccionInventario',
    //'empleados': 'seccionEmpleados',
    //'configuracion': 'seccionConfiguracion'
};

function mostrarSeccionAdmin(seccion) {
    // Ocultar todas las secciones
    var secciones = document.querySelectorAll('.seccion-admin-content');
    for (var j = 0; j < secciones.length; j++) {
        secciones[j].style.display = 'none';
    }

    // Quitar active de todos los items del menu
    var menuItems = document.querySelectorAll('.sidebar-nav li');
    for (var k = 0; k < menuItems.length; k++) {
        menuItems[k].classList.remove('active');
    }

    // Mostrar la seccion correspondiente
    var idSeccion = idsSecciones[seccion];
    if (idSeccion) {
        document.getElementById(idSeccion).style.display = 'block';
    }

    // Activar el item del menu
    var menuItem = document.querySelector('.sidebar-nav li[data-section="' + seccion + '"]');
    if (menuItem) {
        menuItem.classList.add('active');
    }

    // Actualizar titulo
    document.getElementById('tituloSeccion').textContent = titulosSecciones[seccion] || '';
}

// ========================================
// CARGAR PRODUCTO
// ========================================

function verificarSubcategoria() {
    var categoriaSelect = document.getElementById('cpCategoria');
    var contenedorSub = document.getElementById('contenedorSubcategoria');
    var subSelect = document.getElementById('cpSubcategoria');
    var categoriaSeleccionada = categoriaSelect.value;

    // Limpiar subcategoria
    subSelect.innerHTML = '<option value="">-- Seleccionar --</option>';

    // Verificar si la categoria tiene subcategorias
    if (SUBCATEGORIAS[categoriaSeleccionada]) {
        var subs = SUBCATEGORIAS[categoriaSeleccionada];
        for (var l = 0; l < subs.length; l++) {
            var option = document.createElement('option');
            option.value = subs[l];
            option.textContent = subs[l];
            subSelect.appendChild(option);
        }
        contenedorSub.style.display = 'block';
        subSelect.required = true;
    } else {
        contenedorSub.style.display = 'none';
        subSelect.required = false;
    }
}

function toggleStockFields() {
    var checkbox = document.getElementById('cpHabilitarStock');
    var camposStock = document.getElementById('camposStock');

    if (checkbox.checked) {
        camposStock.style.display = 'grid';
    } else {
        camposStock.style.display = 'none';
        document.getElementById('cpStockLocal').value = '';
        document.getElementById('cpStockBajo').value = '';
        document.getElementById('cpStockMuyBajo').value = '';
    }
}

function guardarProducto(event) {
    event.preventDefault();

    var codigo = document.getElementById('cpCodigo').value.trim().toUpperCase();
    var producto = document.getElementById('cpProducto').value.trim();
    var marca = document.getElementById('cpMarca').value.trim();
    var precio = parseFloat(document.getElementById('cpPrecio').value);
    var descripcion = document.getElementById('cpDescripcion').value.trim();
    var categoria = document.getElementById('cpCategoria').value;
    var subcategoria = document.getElementById('cpSubcategoria').value;
    var habilitarStock = document.getElementById('cpHabilitarStock').checked;

    // Validar subcategoria si aplica
    if (SUBCATEGORIAS[categoria] && !subcategoria) {
        alert('Debe seleccionar una subcategoria para ' + categoria);
        return;
    }

    // Verificar codigo duplicado
    if (typeof PRODUCTOS !== 'undefined') {
        for (var m = 0; m < PRODUCTOS.length; m++) {
            if (PRODUCTOS[m].codigo === codigo) {
                alert('Ya existe un producto con el codigo ' + codigo);
                return;
            }
        }
    }

    // Construir nombre completo
    var nombreCompleto = producto + ' - ' + marca;

    // Crear objeto producto
    var nuevoProducto = {
        codigo: codigo,
        nombre: nombreCompleto,
        marca: marca,
        categoria: subcategoria ? categoria + ' > ' + subcategoria : categoria,
        precio: precio,
        descripcion: descripcion || '',
        stock: habilitarStock ? (parseInt(document.getElementById('cpStockLocal').value) || 0) : undefined,
        stockBajo: habilitarStock ? (parseInt(document.getElementById('cpStockBajo').value) || 0) : undefined,
        stockMuyBajo: habilitarStock ? (parseInt(document.getElementById('cpStockMuyBajo').value) || 0) : undefined,
        habilitarStock: habilitarStock,
        fechaCarga: new Date().toLocaleDateString('es-AR'),
        horaCarga: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    // Agregar al array global
    if (typeof PRODUCTOS !== 'undefined') {
        PRODUCTOS.push(nuevoProducto);
    }

    // Agregar a la lista de esta sesion
    productosCargadosSesion.unshift(nuevoProducto);

    // Renderizar lista de recientes
    renderizarProductosCargados();

    // Actualizar estadisticas
    actualizarEstadisticas();

    // Limpiar formulario
    limpiarFormularioProducto();

    // Confirmacion
    mostrarNotificacion('Producto "' + nombreCompleto + '" cargado exitosamente');
}

function limpiarFormularioProducto() {
    document.getElementById('formCargarProducto').reset();
    document.getElementById('contenedorSubcategoria').style.display = 'none';
    document.getElementById('camposStock').style.display = 'none';
}

function renderizarProductosCargados() {
    var container = document.getElementById('listaProductosCargados');

    if (productosCargadosSesion.length === 0) {
        container.innerHTML = '<div class="sin-productos-cargados"><p>No se han cargado productos en esta sesion</p></div>';
        return;
    }

    var html = '';
    html += '<table class="tabla-productos-cargados">';
    html += '<thead><tr>';
    html += '<th>Codigo</th><th>Producto</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Hora</th>';
    html += '</tr></thead><tbody>';

    for (var n = 0; n < productosCargadosSesion.length; n++) {
        var p = productosCargadosSesion[n];
        html += '<tr>';
        html += '<td><span class="codigo-tag">' + p.codigo + '</span></td>';
        html += '<td>' + p.nombre + '</td>';
        html += '<td><span class="cat-tag">' + p.categoria + '</span></td>';
        html += '<td class="precio-col">$' + p.precio.toFixed(2) + '</td>';
        html += '<td>' + (p.habilitarStock ? p.stock : '<span class="sin-stock-tag">N/A</span>') + '</td>';
        html += '<td>' + p.horaCarga + '</td>';
        html += '</tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

function mostrarNotificacion(mensaje) {
    // Crear notificacion
    var notif = document.createElement('div');
    notif.className = 'notificacion-exito';
    notif.innerHTML = '<span>&#10003;</span> ' + mensaje;
    document.body.appendChild(notif);

    // Mostrar con animacion
    setTimeout(function() {
        notif.classList.add('visible');
    }, 100);

    // Ocultar y eliminar
    setTimeout(function() {
        notif.classList.remove('visible');
        setTimeout(function() {
            document.body.removeChild(notif);
        }, 400);
    }, 3000);
}
