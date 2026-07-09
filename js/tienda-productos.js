/**
 * MI DRUGSTORE - Base de Datos de Tienda
 * Definición de Categorías, Subcategorías y Productos
 */

// Estructura de navegación (Categorías y sus Subcategorías)
const ESTRUCTURA_CATEGORIAS = {
    'Regaleria': ['Perfumes', 'Maquillaje', 'General'],
    'Farmacia': ['Medicamentos', 'Venta Libre'],
    'Panaderia': ['Panificados', 'Facturas'],
    'Bazares': ['Tupper', 'Vasos', 'Otros'],
    'Jugueteria': ['Juguetes', 'Juegos de Mesa'],
    'Indumentaria': ['Niño', 'Adulto'],
    'Golosinas': ['Chocolates', 'Caramelos', 'Chicles'],
    'Gas Envasado': ['Garrafas', 'Tubos'],
    'Bebidas': ['Con Alcohol', 'Sin Alcohol'],
    'Cotillon': ['Fiesta', 'Cumpleaños'],
    'Forrajeria': ['Alimento Mascotas', 'Semillas'],
    'Embutidos': ['Hamburguesas', 'Salchichas', 'Fiambres'],
    'Lacteos': ['Leches', 'Yogures', 'Quesos'],
    'Ropa Intima': ['Dama', 'Caballero'],
    'Merceria': ['Hilos', 'Agujas', 'Botones'],
    'Escolar': ['Cuadernos', 'Lápices', 'Mochilas'],
    'Almacen': ['Comestibles', 'Limpieza'],
    'Cigarrillos': ['Comunes', 'Mentolados']
};

const PRODUCTOS_TIENDA = [
    // 1. Regaleria
    { codigo: 'REG001', nombre: 'Perfume Kevin Black', marca: 'Kevin', categoria: 'Regaleria', subcategoria: 'Perfumes', precio: 12500, stock: 5 },
    { codigo: 'REG002', nombre: 'Labial Rojo Mate', marca: 'Maybelline', categoria: 'Regaleria', subcategoria: 'Maquillaje', precio: 4500, stock: 10 },
    
    // 4. Bazares
    { codigo: 'BAZ001', nombre: 'Hermético Cuadrado 1L', marca: 'Tupperware', categoria: 'Bazares', subcategoria: 'Tupper', precio: 3200, stock: 15 },
    { codigo: 'BAZ002', nombre: 'Vaso Vidrio Trago Largo', marca: 'Rigolleau', categoria: 'Bazares', subcategoria: 'Vasos', precio: 800, stock: 40 },
    
    // 6. Indumentaria
    { codigo: 'IND001', nombre: 'Remera Algodón Talle 4', marca: 'Mimo', categoria: 'Indumentaria', subcategoria: 'Niño', precio: 8000, stock: 8 },
    { codigo: 'IND002', nombre: 'Camisa Cuadros L', marca: 'Taverniti', categoria: 'Indumentaria', subcategoria: 'Adulto', precio: 15000, stock: 3 },
    
    // 9. Bebidas
    { codigo: 'BEB001', nombre: 'Cerveza Lata 473ml', marca: 'Brahma', categoria: 'Bebidas', subcategoria: 'Con Alcohol', precio: 1200, stock: 100 },
    { codigo: 'BEB002', nombre: 'Vino Malbec', marca: 'Rutini', categoria: 'Bebidas', subcategoria: 'Con Alcohol', precio: 8500, stock: 12 },
    { codigo: 'BEB003', nombre: 'Coca Cola 2.25L', marca: 'Coca Cola', categoria: 'Bebidas', subcategoria: 'Sin Alcohol', precio: 2800, stock: 50 },
    { codigo: 'BEB004', nombre: 'Agua Mineral 1.5L', marca: 'Villavicencio', categoria: 'Bebidas', subcategoria: 'Sin Alcohol', precio: 1100, stock: 30 },

    // 12. Embutidos
    { codigo: 'EMB001', nombre: 'Hamburguesa x4', marca: 'Paty', categoria: 'Embutidos', subcategoria: 'Hamburguesas', precio: 3500, stock: 20 },
    { codigo: 'EMB002', nombre: 'Salchicha Viena x6', marca: 'Paladini', categoria: 'Embutidos', subcategoria: 'Salchichas', precio: 1800, stock: 25 },

    // 18. Cigarrillos
    { codigo: 'CIG001', nombre: 'Box 20', marca: 'Marlboro', categoria: 'Cigarrillos', subcategoria: 'Comunes', precio: 2500, stock: 50 },
    { codigo: 'CIG002', nombre: 'Convertibles Box', marca: 'Lucky Strike', categoria: 'Cigarrillos', subcategoria: 'Mentolados', precio: 2400, stock: 45 }
    // ... Puedes agregar más productos siguiendo este esquema
];

/**
 * Buscar en toda la tienda
 */
function buscarProductosTiendaGlobal(termino) {
    if (!termino || termino.trim() === '') return [];
    const t = termino.toLowerCase().trim();
    
    return PRODUCTOS_TIENDA.filter(p => 
        p.codigo.toLowerCase().includes(t) ||
        p.nombre.toLowerCase().includes(t) ||
        p.marca.toLowerCase().includes(t)
    );
}

/**
 * Filtrar por categoría y subcategoría
 */
function obtenerProductosPorCategoria(categoria, subcategoria = null) {
    return PRODUCTOS_TIENDA.filter(p => {
        if (subcategoria) {
            return p.categoria === categoria && p.subcategoria === subcategoria;
        }
        return p.categoria === categoria;
    });
}