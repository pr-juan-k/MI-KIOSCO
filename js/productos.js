/**
 * MI DRUGSTORE - Base de Datos de Productos
 * Lista de productos de ejemplo para el sistema
 */

const PRODUCTOS = [
    // Medicamentos
    { codigo: 'MED001', nombre: 'Paracetamol 500mg x20', categoria: 'Medicamentos', precio: 850 },
    { codigo: 'MED002', nombre: 'Ibuprofeno 400mg x10', categoria: 'Medicamentos', precio: 1200 },
    { codigo: 'MED003', nombre: 'Amoxicilina 500mg x21', categoria: 'Medicamentos', precio: 2500 },
    { codigo: 'MED004', nombre: 'Omeprazol 20mg x14', categoria: 'Medicamentos', precio: 1800 },
    { codigo: 'MED005', nombre: 'Loratadina 10mg x10', categoria: 'Medicamentos', precio: 950 },
    { codigo: 'MED006', nombre: 'Aspirina 100mg x20', categoria: 'Medicamentos', precio: 750 },
    { codigo: 'MED007', nombre: 'Diclofenac 50mg x20', categoria: 'Medicamentos', precio: 1100 },
    { codigo: 'MED008', nombre: 'Ranitidina 150mg x20', categoria: 'Medicamentos', precio: 1350 },
    { codigo: 'MED009', nombre: 'Metformina 850mg x30', categoria: 'Medicamentos', precio: 2200 },
    { codigo: 'MED010', nombre: 'Enalapril 10mg x30', categoria: 'Medicamentos', precio: 1650 },

    // Vitaminas y Suplementos
    { codigo: 'VIT001', nombre: 'Vitamina C 1000mg x30', categoria: 'Vitaminas', precio: 1500 },
    { codigo: 'VIT002', nombre: 'Vitamina D 1000UI x60', categoria: 'Vitaminas', precio: 2100 },
    { codigo: 'VIT003', nombre: 'Multivitaminico x30', categoria: 'Vitaminas', precio: 2800 },
    { codigo: 'VIT004', nombre: 'Omega 3 x60', categoria: 'Vitaminas', precio: 3200 },
    { codigo: 'VIT005', nombre: 'Calcio + D x60', categoria: 'Vitaminas', precio: 1900 },
    { codigo: 'VIT006', nombre: 'Hierro 40mg x30', categoria: 'Vitaminas', precio: 1200 },
    { codigo: 'VIT007', nombre: 'Magnesio 400mg x30', categoria: 'Vitaminas', precio: 1400 },
    { codigo: 'VIT008', nombre: 'Zinc 50mg x30', categoria: 'Vitaminas', precio: 1100 },

    // Higiene Personal
    { codigo: 'HIG001', nombre: 'Jabon Liquido 250ml', categoria: 'Higiene', precio: 650 },
    { codigo: 'HIG002', nombre: 'Shampoo 400ml', categoria: 'Higiene', precio: 1800 },
    { codigo: 'HIG003', nombre: 'Pasta Dental 120g', categoria: 'Higiene', precio: 950 },
    { codigo: 'HIG004', nombre: 'Cepillo Dental', categoria: 'Higiene', precio: 550 },
    { codigo: 'HIG005', nombre: 'Desodorante Roll-on', categoria: 'Higiene', precio: 1200 },
    { codigo: 'HIG006', nombre: 'Alcohol en Gel 500ml', categoria: 'Higiene', precio: 1400 },
    { codigo: 'HIG007', nombre: 'Toallitas Humedas x50', categoria: 'Higiene', precio: 800 },
    { codigo: 'HIG008', nombre: 'Protector Solar FPS50', categoria: 'Higiene', precio: 3500 },

    // Primeros Auxilios
    { codigo: 'PRI001', nombre: 'Curitas x20', categoria: 'Primeros Auxilios', precio: 450 },
    { codigo: 'PRI002', nombre: 'Gasa Esteril x10', categoria: 'Primeros Auxilios', precio: 380 },
    { codigo: 'PRI003', nombre: 'Venda Elastica 5cm', categoria: 'Primeros Auxilios', precio: 520 },
    { codigo: 'PRI004', nombre: 'Agua Oxigenada 250ml', categoria: 'Primeros Auxilios', precio: 350 },
    { codigo: 'PRI005', nombre: 'Alcohol 250ml', categoria: 'Primeros Auxilios', precio: 420 },
    { codigo: 'PRI006', nombre: 'Termometro Digital', categoria: 'Primeros Auxilios', precio: 2800 },
    { codigo: 'PRI007', nombre: 'Tensiometro Digital', categoria: 'Primeros Auxilios', precio: 8500 },

    // Cuidado Bebe
    { codigo: 'BEB001', nombre: 'Panales x20 RN', categoria: 'Bebe', precio: 2200 },
    { codigo: 'BEB002', nombre: 'Panales x20 M', categoria: 'Bebe', precio: 2400 },
    { codigo: 'BEB003', nombre: 'Panales x20 G', categoria: 'Bebe', precio: 2600 },
    { codigo: 'BEB004', nombre: 'Crema Antipanalitis', categoria: 'Bebe', precio: 1800 },
    { codigo: 'BEB005', nombre: 'Mamadera 250ml', categoria: 'Bebe', precio: 1500 },
    { codigo: 'BEB006', nombre: 'Chupete Anatomico', categoria: 'Bebe', precio: 950 },
    { codigo: 'BEB007', nombre: 'Talco Bebe 200g', categoria: 'Bebe', precio: 780 },

    // Dermocosmetica
    { codigo: 'DER001', nombre: 'Crema Hidratante 200ml', categoria: 'Dermocosmetica', precio: 2800 },
    { codigo: 'DER002', nombre: 'Serum Facial 30ml', categoria: 'Dermocosmetica', precio: 4500 },
    { codigo: 'DER003', nombre: 'Crema Antiarrugas 50ml', categoria: 'Dermocosmetica', precio: 5200 },
    { codigo: 'DER004', nombre: 'Agua Micelar 400ml', categoria: 'Dermocosmetica', precio: 2200 },
    { codigo: 'DER005', nombre: 'Contorno de Ojos 15ml', categoria: 'Dermocosmetica', precio: 3800 },

    // Otros
    { codigo: 'OTR001', nombre: 'Barbijo x50', categoria: 'Otros', precio: 1200 },
    { codigo: 'OTR002', nombre: 'Guantes Latex x100', categoria: 'Otros', precio: 2500 },
    { codigo: 'OTR003', nombre: 'Jeringa 5ml x10', categoria: 'Otros', precio: 680 },
    { codigo: 'OTR004', nombre: 'Algodon 100g', categoria: 'Otros', precio: 450 },
    { codigo: 'OTR005', nombre: 'Test Embarazo', categoria: 'Otros', precio: 1800 }
];

/**
 * Buscar productos por codigo, nombre o precio
 * @param {string} termino - Termino de busqueda
 * @returns {Array} - Productos encontrados
 */
function buscarProductos(termino) {
    if (!termino || termino.trim() === '') {
        return [];
    }
    
    const terminoLower = termino.toLowerCase().trim();
    
    return PRODUCTOS.filter(producto => {
        return producto.codigo.toLowerCase().includes(terminoLower) ||
               producto.nombre.toLowerCase().includes(terminoLower) ||
               producto.precio.toString().includes(terminoLower) ||
               producto.categoria.toLowerCase().includes(terminoLower);
    });
}

/**
 * Obtener producto por codigo
 * @param {string} codigo - Codigo del producto
 * @returns {Object|null} - Producto encontrado o null
 */
function obtenerProductoPorCodigo(codigo) {
    return PRODUCTOS.find(p => p.codigo === codigo) || null;
}

/**
 * Formatear precio a moneda
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Obtener hora actual formateada
 * @returns {string} - Hora actual HH:MM:SS
 */
function obtenerHoraActual() {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Obtener fecha actual formateada
 * @returns {string} - Fecha actual DD/MM/YYYY
 */
function obtenerFechaActual() {
    return new Date().toLocaleDateString('es-AR');
}
