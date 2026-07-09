/**
 * MI DRUGSTORE - Sistema de Gestión
 * Módulo de Empleado - Sistema de Ventas
 * 
 * Las funciones buscarProductos, formatearPrecio, obtenerProductoPorCodigo,
 * obtenerHoraActual y obtenerFechaActual están definidas en productos.js
 */

// Variables globales
var turnoSeleccionado = null;
var fechaHoraInicio = null;
var ventas = [];
var contadorClientes = 0;
var productosDespacho = [];

// Inicializacion
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    inicializarEventos();
});

function verificarSesion() {
    var usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
    var nombreUsuario = sessionStorage.getItem('nombreUsuario');
    
    if (!usuarioLogueado) {
        window.location.href = 'index.html';
        return;
    }
    
    if (usuarioLogueado === 'admin') {
        window.location.href = 'admin.html';
        return;
    }

    var turnoGuardado = sessionStorage.getItem('turnoEmpleado');
    var fechaGuardada = sessionStorage.getItem('fechaInicioTurno');

    if (turnoGuardado && fechaGuardada) {
        turnoSeleccionado = turnoGuardado;
        fechaHoraInicio = fechaGuardada;
        cargarDatosEmpleado();
        cargarVentasGuardadas();
    } else {
        mostrarModalTurno(nombreUsuario);
    }
}

function mostrarModalTurno(nombreUsuario) {
    var modal = document.getElementById('modalTurno');
    var nombreElement = document.getElementById('nombreEmpleadoModal');
    nombreElement.textContent = 'Bienvenido, ' + nombreUsuario;
    modal.style.display = 'flex';
}

function seleccionarTurno(turno) {
    turnoSeleccionado = turno;
    fechaHoraInicio = new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    sessionStorage.setItem('turnoEmpleado', turnoSeleccionado);
    sessionStorage.setItem('fechaInicioTurno', fechaHoraInicio);

    document.getElementById('modalTurno').style.display = 'none';
    cargarDatosEmpleado();
}

function cargarDatosEmpleado() {
    var nombreUsuario = sessionStorage.getItem('nombreUsuario');
    
    document.getElementById('nombreEmpleadoHeader').textContent = nombreUsuario;
    document.getElementById('nombreUsuario').textContent = nombreUsuario;
    document.getElementById('badgeTurno').textContent = 'Turno: ' + turnoSeleccionado;
    document.getElementById('fechaInicio').textContent = 'Inicio: ' + fechaHoraInicio;
}

function cargarVentasGuardadas() {
    var ventasGuardadas = sessionStorage.getItem('ventasDelDia');
    if (ventasGuardadas) {
        ventas = JSON.parse(ventasGuardadas);
        contadorClientes = ventas.length;
        renderizarVentas();
        actualizarResumen();
    }
}

function inicializarEventos() {
    var buscadorVentas = document.getElementById('buscadorVentas');
    if (buscadorVentas) {
        buscadorVentas.addEventListener('input', filtrarVentas);
    }

    var buscadorDespachar = document.getElementById('buscadorProductoDespachar');
    if (buscadorDespachar) {
        buscadorDespachar.addEventListener('input', buscarProductosDespachar);
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.buscador-despachar')) {
            var resultados = document.getElementById('resultadosBusquedaDespachar');
            if (resultados) {
                resultados.innerHTML = '';
            }
        }
    });
}

// DESPACHAR / NUEVA VENTA

function abrirModalDespachar() {
    productosDespacho = [];
    contadorClientes++;
    
    document.getElementById('clienteActualModal').textContent = 'Cliente C' + contadorClientes;
    document.getElementById('totalDespachar').textContent = '$0.00';
    document.getElementById('productosDespacharBody').innerHTML = '<tr class="empty-row"><td colspan="5">No hay productos agregados</td></tr>';
    document.getElementById('buscadorProductoDespachar').value = '';
    document.getElementById('resultadosBusquedaDespachar').innerHTML = '';
    
    var radios = document.querySelectorAll('input[name="metodoPago"]');
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
    document.getElementById('errorMetodoPago').textContent = '';

    document.getElementById('modalDespachar').style.display = 'flex';
    document.getElementById('buscadorProductoDespachar').focus();
}

function cerrarModalDespachar() {
    document.getElementById('modalDespachar').style.display = 'none';
    if (productosDespacho.length === 0) {
        contadorClientes--;
    }
}

function buscarProductosDespachar() {
    var termino = document.getElementById('buscadorProductoDespachar').value;
    var resultadosContainer = document.getElementById('resultadosBusquedaDespachar');
    
    if (termino.length < 2) {
        resultadosContainer.innerHTML = '';
        return;
    }

    // Usar la funcion de busqueda local que accede a PRODUCTOS de productos.js
    var resultados = buscarProductosLocal(termino);
    
    if (resultados.length === 0) {
        resultadosContainer.innerHTML = '<div class="no-resultados">No se encontraron productos</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < resultados.length; i++) {
        var producto = resultados[i];
        html += '<div class="resultado-item" onclick="agregarProductoDespacho(\'' + producto.codigo + '\')">';
        html += '<span class="resultado-codigo">' + producto.codigo + '</span>';
        html += '<span class="resultado-nombre">' + producto.nombre + '</span>';
        html += '<span class="resultado-precio">' + formatearPrecioLocal(producto.precio) + '</span>';
        html += '</div>';
    }
    resultadosContainer.innerHTML = html;
}

// Funcion de busqueda local como respaldo
function buscarProductosLocal(termino) {
    if (!termino || termino.trim() === '') {
        return [];
    }
    
    if (typeof PRODUCTOS === 'undefined' || PRODUCTOS.length === 0) {
        return [];
    }
    
    var terminoLower = termino.toLowerCase().trim();
    
    return PRODUCTOS.filter(function(producto) {
        return producto.codigo.toLowerCase().indexOf(terminoLower) !== -1 ||
               producto.nombre.toLowerCase().indexOf(terminoLower) !== -1 ||
               producto.precio.toString().indexOf(terminoLower) !== -1 ||
               producto.categoria.toLowerCase().indexOf(terminoLower) !== -1;
    });
}

function formatearPrecioLocal(precio) {
    return '$' + precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function obtenerProductoPorCodigoLocal(codigo) {
    if (typeof PRODUCTOS === 'undefined') {
        return null;
    }
    for (var i = 0; i < PRODUCTOS.length; i++) {
        if (PRODUCTOS[i].codigo === codigo) {
            return PRODUCTOS[i];
        }
    }
    return null;
}

function obtenerHoraActualLocal() {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function obtenerFechaActualLocal() {
    return new Date().toLocaleDateString('es-AR');
}

function agregarProductoDespacho(codigo) {
    var producto = obtenerProductoPorCodigoLocal(codigo);
    if (!producto) {
        return;
    }

    var productoDespacho = {
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        hora: obtenerHoraActualLocal(),
        numero: productosDespacho.length + 1
    };

    productosDespacho.push(productoDespacho);
    renderizarProductosDespacho();
    
    document.getElementById('buscadorProductoDespachar').value = '';
    document.getElementById('resultadosBusquedaDespachar').innerHTML = '';
    document.getElementById('buscadorProductoDespachar').focus();
}

function eliminarProductoDespacho(index) {
    productosDespacho.splice(index, 1);
    for (var i = 0; i < productosDespacho.length; i++) {
        productosDespacho[i].numero = i + 1;
    }
    renderizarProductosDespacho();
}

function renderizarProductosDespacho() {
    var tbody = document.getElementById('productosDespacharBody');
    
    if (productosDespacho.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No hay productos agregados</td></tr>';
        document.getElementById('totalDespachar').textContent = '$0.00';
        return;
    }

    var html = '';
    var total = 0;
    for (var i = 0; i < productosDespacho.length; i++) {
        var producto = productosDespacho[i];
        total += producto.precio;
        html += '<tr>';
        html += '<td>' + producto.numero + '</td>';
        html += '<td>' + producto.codigo + '</td>';
        html += '<td>' + producto.nombre + '</td>';
        html += '<td>' + formatearPrecioLocal(producto.precio) + '</td>';
        html += '<td><button class="btn-eliminar-producto" onclick="eliminarProductoDespacho(' + i + ')">X</button></td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;

    document.getElementById('totalDespachar').textContent = formatearPrecioLocal(total);
}

function confirmarVenta() {
    if (productosDespacho.length === 0) {
        alert('Debe agregar al menos un producto');
        return;
    }

    var metodoPago = document.querySelector('input[name="metodoPago"]:checked');
    if (!metodoPago) {
        document.getElementById('errorMetodoPago').textContent = 'Seleccione un metodo de pago';
        return;
    }

    var total = 0;
    for (var i = 0; i < productosDespacho.length; i++) {
        total += productosDespacho[i].precio;
    }

    var venta = {
        cliente: 'C' + contadorClientes,
        productos: productosDespacho.slice(),
        metodoPago: metodoPago.value,
        total: total,
        hora: obtenerHoraActualLocal(),
        fecha: obtenerFechaActualLocal(),
        nota: ''
    };

    ventas.push(venta);
    guardarVentas();
    renderizarVentas();
    actualizarResumen();

    document.getElementById('modalDespachar').style.display = 'none';
    productosDespacho = [];
}

function guardarVentas() {
    sessionStorage.setItem('ventasDelDia', JSON.stringify(ventas));
}

// RENDERIZAR VENTAS

var paginaActualVentas = 0;
var ventasPorPagina = 15;

function renderizarVentas() {
    var container = document.getElementById('tablaVentas');

    if (ventas.length === 0) {
        container.innerHTML = '<div class="sin-ventas"><span>📋</span><p>No hay ventas registradas aun</p></div>';
        return;
    }

    // Invertir para mostrar las mas recientes primero
    var ventasOrdenadas = ventas.slice().reverse();
    
    // Calcular ventas a mostrar segun paginacion
    var inicio = 0;
    var fin = Math.min((paginaActualVentas + 1) * ventasPorPagina, ventasOrdenadas.length);
    var ventasAMostrar = ventasOrdenadas.slice(inicio, fin);

    var html = '';
    
    for (var v = 0; v < ventasAMostrar.length; v++) {
        var venta = ventasAMostrar[v];
        var pagoIcon = venta.metodoPago === 'Efectivo' ? '💵' : '📱';
        var indexOriginal = ventas.length - 1 - (v + (paginaActualVentas * ventasPorPagina));
        
        html += '<div class="subtabla-cliente colapsada" data-venta-index="' + indexOriginal + '">';
        
        // Header clickeable (siempre visible)
        html += '<div class="subtabla-header clickeable" onclick="toggleDetalleVenta(this)">';
        html += '<div class="cliente-info-compacta">';
        html += '<span class="cliente-badge">' + venta.cliente + '</span>';
        html += '<span class="cliente-hora">' + venta.hora + '</span>';
        html += '<span class="cliente-pago ' + venta.metodoPago.toLowerCase() + '">' + pagoIcon + ' ' + venta.metodoPago + '</span>';
        html += '<span class="cliente-total-inline">Total: ' + formatearPrecioLocal(venta.total) + '</span>';
        html += '</div>';
        html += '<span class="toggle-icon">▼</span>';
        html += '</div>';
        
        // Contenido colapsable (oculto por defecto)
        html += '<div class="detalle-venta" style="display: none;">';
        html += '<table class="tabla-productos-cliente">';
        html += '<thead><tr><th>#</th><th>Codigo</th><th>Producto</th><th>Hora</th><th>Precio</th></tr></thead>';
        html += '<tbody>';
        
        for (var p = 0; p < venta.productos.length; p++) {
            var producto = venta.productos[p];
            html += '<tr>';
            html += '<td>' + producto.numero + '</td>';
            html += '<td>' + producto.codigo + '</td>';
            html += '<td>' + producto.nombre + '</td>';
            html += '<td>' + producto.hora + '</td>';
            html += '<td>' + formatearPrecioLocal(producto.precio) + '</td>';
            html += '</tr>';
        }
        
        html += '</tbody></table>';
        
        html += '<div class="nota-cliente">';
        html += '<input type="text" placeholder="Agregar nota (opcional)..." value="' + (venta.nota || '') + '" onchange="actualizarNota(' + indexOriginal + ', this.value)">';
        html += '</div>';
        html += '</div>'; // fin detalle-venta
        html += '</div>'; // fin subtabla-cliente
    }
    
    // Mostrar boton "Ver mas" si hay mas ventas
    if (fin < ventasOrdenadas.length) {
        html += '<div class="ver-mas-container">';
        html += '<button class="btn-ver-mas" onclick="cargarMasVentas()">';
        html += '<span>▼</span> Ver mas ventas (' + (ventasOrdenadas.length - fin) + ' restantes)';
        html += '</button>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function toggleDetalleVenta(headerElement) {
    var subtabla = headerElement.parentElement;
    var detalle = subtabla.querySelector('.detalle-venta');
    var toggleIcon = headerElement.querySelector('.toggle-icon');
    
    if (subtabla.classList.contains('colapsada')) {
        subtabla.classList.remove('colapsada');
        subtabla.classList.add('expandida');
        detalle.style.display = 'block';
        toggleIcon.textContent = '▲';
    } else {
        subtabla.classList.remove('expandida');
        subtabla.classList.add('colapsada');
        detalle.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
}

function cargarMasVentas() {
    paginaActualVentas++;
    renderizarVentas();
}

function actualizarNota(ventaIndex, nota) {
    ventas[ventaIndex].nota = nota;
    guardarVentas();
}

function filtrarVentas() {
    var termino = document.getElementById('buscadorVentas').value.toLowerCase();
    
    if (!termino) {
        renderizarVentas();
        return;
    }

    var ventasFiltradas = [];
    for (var i = 0; i < ventas.length; i++) {
        var venta = ventas[i];
        var encontrado = false;
        for (var j = 0; j < venta.productos.length; j++) {
            var producto = venta.productos[j];
            if (producto.nombre.toLowerCase().indexOf(termino) !== -1 ||
                producto.codigo.toLowerCase().indexOf(termino) !== -1) {
                encontrado = true;
                break;
            }
        }
        if (encontrado) {
            ventasFiltradas.push(venta);
        }
    }

    var container = document.getElementById('tablaVentas');

    if (ventasFiltradas.length === 0) {
        container.innerHTML = '<div class="sin-ventas"><span>🔍</span><p>No se encontraron ventas con "' + termino + '"</p></div>';
        return;
    }

    var html = '';
    for (var v = 0; v < ventasFiltradas.length; v++) {
        var venta = ventasFiltradas[v];
        var pagoIcon = venta.metodoPago === 'Efectivo' ? '💵' : '📱';
        
        html += '<div class="subtabla-cliente">';
        html += '<div class="subtabla-header">';
        html += '<div class="cliente-info">';
        html += '<span class="cliente-badge">' + venta.cliente + '</span>';
        html += '<span class="cliente-hora">' + venta.hora + '</span>';
        html += '<span class="cliente-pago ' + venta.metodoPago.toLowerCase() + '">' + pagoIcon + ' ' + venta.metodoPago + '</span>';
        html += '</div>';
        html += '<div class="cliente-total"><span>Total: ' + formatearPrecioLocal(venta.total) + '</span></div>';
        html += '</div>';
        
        html += '<table class="tabla-productos-cliente">';
        html += '<thead><tr><th>#</th><th>Codigo</th><th>Producto</th><th>Hora</th><th>Precio</th></tr></thead>';
        html += '<tbody>';
        
        for (var p = 0; p < venta.productos.length; p++) {
            var producto = venta.productos[p];
            var resaltado = (producto.nombre.toLowerCase().indexOf(termino) !== -1 || 
                           producto.codigo.toLowerCase().indexOf(termino) !== -1) ? ' class="resaltado"' : '';
            html += '<tr' + resaltado + '>';
            html += '<td>' + producto.numero + '</td>';
            html += '<td>' + producto.codigo + '</td>';
            html += '<td>' + producto.nombre + '</td>';
            html += '<td>' + producto.hora + '</td>';
            html += '<td>' + formatearPrecioLocal(producto.precio) + '</td>';
            html += '</tr>';
        }
        
        html += '</tbody></table>';
        
        html += '<div class="nota-cliente">';
        html += '<input type="text" placeholder="Agregar nota (opcional)..." value="' + (venta.nota || '') + '">';
        html += '</div>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

// RESUMEN Y CIERRE DE CAJA

function actualizarResumen() {
    var totalEfectivo = 0;
    var totalTransferencia = 0;

    for (var i = 0; i < ventas.length; i++) {
        if (ventas[i].metodoPago === 'Efectivo') {
            totalEfectivo += ventas[i].total;
        } else {
            totalTransferencia += ventas[i].total;
        }
    }

    document.getElementById('totalEfectivo').textContent = formatearPrecioLocal(totalEfectivo);
    document.getElementById('totalTransferencia').textContent = formatearPrecioLocal(totalTransferencia);
    document.getElementById('totalGeneral').textContent = formatearPrecioLocal(totalEfectivo + totalTransferencia);
}

function abrirModalCerrarCaja() {
    if (ventas.length === 0) {
        alert('No hay ventas registradas para cerrar caja');
        return;
    }

    var totalEfectivo = 0;
    var totalTransferencia = 0;

    for (var i = 0; i < ventas.length; i++) {
        if (ventas[i].metodoPago === 'Efectivo') {
            totalEfectivo += ventas[i].total;
        } else {
            totalTransferencia += ventas[i].total;
        }
    }

    document.getElementById('fechaCierreCaja').textContent = 'Fecha: ' + obtenerFechaActualLocal() + ' - ' + obtenerHoraActualLocal();
    document.getElementById('cierreTotalClientes').textContent = ventas.length;
    document.getElementById('cierreTotalEfectivo').textContent = formatearPrecioLocal(totalEfectivo);
    document.getElementById('cierreTotalTransferencia').textContent = formatearPrecioLocal(totalTransferencia);
    document.getElementById('cierreTotalGeneral').textContent = formatearPrecioLocal(totalEfectivo + totalTransferencia);

    // Limpiar campos de verificacion
    document.getElementById('cierreUsuario').value = '';
    document.getElementById('cierrePassword').value = '';
    document.getElementById('errorCierre').textContent = '';

    document.getElementById('modalCerrarCaja').style.display = 'flex';
}

function cerrarModalCaja() {
    document.getElementById('modalCerrarCaja').style.display = 'none';
}

function confirmarCierreCaja() {
    var usuarioIngresado = document.getElementById('cierreUsuario').value.trim();
    var passwordIngresado = document.getElementById('cierrePassword').value.toLowerCase().trim();
    var nombreUsuarioGuardado = sessionStorage.getItem('nombreUsuario');
    
    // Validar credenciales
    if (usuarioIngresado === '') {
        document.getElementById('errorCierre').textContent = 'Ingrese su nombre de usuario';
        return;
    }
    
    if (usuarioIngresado !== nombreUsuarioGuardado) {
        document.getElementById('errorCierre').textContent = 'El nombre de usuario no coincide';
        return;
    }
    
    if (passwordIngresado !== 'empleado') {
        document.getElementById('errorCierre').textContent = 'Contrasena incorrecta';
        return;
    }
    
    // Si las credenciales son correctas, cerrar caja
    ventas = [];
    contadorClientes = 0;
    paginaActualVentas = 0;
    sessionStorage.removeItem('ventasDelDia');
    
    renderizarVentas();
    actualizarResumen();
    
    document.getElementById('modalCerrarCaja').style.display = 'none';
    alert('Caja cerrada exitosamente');
}

function cerrarSesion() {
    // Verificar si hay ventas sin cerrar
    if (ventas.length > 0) {
        alert('No puede cerrar sesion con ventas registradas. Primero debe cerrar caja.');
        return;
    }
    
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ========================================
// NAVEGACION ENTRE SECCIONES
// ========================================

function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    var secciones = document.querySelectorAll('.seccion-content');
    for (var i = 0; i < secciones.length; i++) {
        secciones[i].style.display = 'none';
    }

    // Quitar clase active de todos los items del menu
    var menuItems = document.querySelectorAll('.sidebar-nav li');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].classList.remove('active');
    }

    // Mostrar la seccion seleccionada
    if (seccion === 'inicio') {
        document.getElementById('seccionInicio').style.display = 'block';
    } else if (seccion === 'ventas') {
        document.getElementById('seccionVentas').style.display = 'block';
        actualizarTablasVentas();
    } else if (seccion === 'productos') {
        document.getElementById('seccionProductos').style.display = 'block';
        renderizarInventario();
    }

    // Agregar clase active al item del menu
    var menuItem = document.querySelector('.sidebar-nav li[data-section="' + seccion + '"]');
    if (menuItem) {
        menuItem.classList.add('active');
    }
}

// ========================================
// SECCION VENTAS - Tablas por metodo de pago
// ========================================

function actualizarTablasVentas() {
    var ventasEfectivo = [];
    var ventasTransferencia = [];
    var totalEfectivo = 0;
    var totalTransferencia = 0;

    for (var i = 0; i < ventas.length; i++) {
        if (ventas[i].metodoPago === 'Efectivo') {
            ventasEfectivo.push(ventas[i]);
            totalEfectivo += ventas[i].total;
        } else {
            ventasTransferencia.push(ventas[i]);
            totalTransferencia += ventas[i].total;
        }
    }

    // Renderizar tabla de efectivo
    var tbodyEfectivo = document.getElementById('tablaEfectivoBody');
    if (ventasEfectivo.length === 0) {
        tbodyEfectivo.innerHTML = '<tr class="sin-datos"><td colspan="4">No hay ventas en efectivo</td></tr>';
    } else {
        var htmlEfectivo = '';
        for (var i = 0; i < ventasEfectivo.length; i++) {
            var v = ventasEfectivo[i];
            htmlEfectivo += '<tr>';
            htmlEfectivo += '<td><span class="cliente-badge-small">' + v.cliente + '</span></td>';
            htmlEfectivo += '<td>' + v.fecha + '</td>';
            htmlEfectivo += '<td>' + v.hora + '</td>';
            htmlEfectivo += '<td class="monto">' + formatearPrecioLocal(v.total) + '</td>';
            htmlEfectivo += '</tr>';
        }
        tbodyEfectivo.innerHTML = htmlEfectivo;
    }

    // Renderizar tabla de transferencia
    var tbodyTransferencia = document.getElementById('tablaTransferenciaBody');
    if (ventasTransferencia.length === 0) {
        tbodyTransferencia.innerHTML = '<tr class="sin-datos"><td colspan="4">No hay ventas por transferencia</td></tr>';
    } else {
        var htmlTransferencia = '';
        for (var i = 0; i < ventasTransferencia.length; i++) {
            var v = ventasTransferencia[i];
            htmlTransferencia += '<tr>';
            htmlTransferencia += '<td><span class="cliente-badge-small">' + v.cliente + '</span></td>';
            htmlTransferencia += '<td>' + v.fecha + '</td>';
            htmlTransferencia += '<td>' + v.hora + '</td>';
            htmlTransferencia += '<td class="monto">' + formatearPrecioLocal(v.total) + '</td>';
            htmlTransferencia += '</tr>';
        }
        tbodyTransferencia.innerHTML = htmlTransferencia;
    }

    // Actualizar totales
    document.getElementById('totalEfectivoSeccion').textContent = formatearPrecioLocal(totalEfectivo);
    document.getElementById('totalTransferenciaSeccion').textContent = formatearPrecioLocal(totalTransferencia);
}

// ========================================
// SECCION PRODUCTOS - Inventario
// ========================================

function renderizarInventario(productosAMostrar) {
    var productos = productosAMostrar || PRODUCTOS;
    var tbody = document.getElementById('tablaInventarioBody');
    
    if (!tbody) return;

    var html = '';
    for (var i = 0; i < productos.length; i++) {
        var p = productos[i];
        var estadoClase = obtenerClaseStock(p.stock);
        var estadoTexto = obtenerTextoStock(p.stock);
        
        html += '<tr class="' + estadoClase + '-row">';
        html += '<td><span class="codigo-producto">' + p.codigo + '</span></td>';
        html += '<td>' + p.nombre + '</td>';
        html += '<td><span class="categoria-badge">' + p.categoria + '</span></td>';
        html += '<td class="precio">' + formatearPrecioLocal(p.precio) + '</td>';
        html += '<td class="stock-cantidad ' + estadoClase + '">' + p.stock + '</td>';
        html += '<td><span class="estado-badge ' + estadoClase + '">' + estadoTexto + '</span></td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

function obtenerClaseStock(stock) {
    if (stock === 0) return 'sin-stock';
    if (stock < 10) return 'stock-critico';
    if (stock <= 40) return 'stock-bajo';
    return 'stock-suficiente';
}

function obtenerTextoStock(stock) {
    if (stock === 0) return 'Sin Stock';
    if (stock < 10) return 'Critico';
    if (stock <= 40) return 'Bajo';
    return 'OK';
}

function filtrarInventario() {
    var termino = document.getElementById('buscadorInventario').value.toLowerCase().trim();
    
    if (!termino) {
        renderizarInventario();
        return;
    }

    var productosFiltrados = PRODUCTOS.filter(function(p) {
        return p.codigo.toLowerCase().indexOf(termino) !== -1 ||
               p.nombre.toLowerCase().indexOf(termino) !== -1 ||
               p.categoria.toLowerCase().indexOf(termino) !== -1;
    });

    renderizarInventario(productosFiltrados);
}
