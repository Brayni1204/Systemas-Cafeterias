// backend/src/api/controllers/producto.controller.js

// Importamos la FUNCIÓN que define el modelo, no el modelo directamente
import { defineProductoModel } from '../models/Producto.js';

// Obtener todos los productos para el inquilino actual
export const getProductos = async (req, res) => {
  try {
    // 1. Obtenemos la conexión específica del inquilino que el middleware nos dio
    const tenantConnection = req.tenantDbConnection;
    if (!tenantConnection) {
        return res.status(500).json({ message: "La conexión con la base de datos del inquilino no está disponible." });
    }

    // 2. Definimos el modelo 'Producto' usando esa conexión específica
    const Producto = defineProductoModel(tenantConnection);
    
    // 3. Usamos el modelo para buscar todos los productos en la BD de ese inquilino
    const productos = await Producto.findAll();
    
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Aquí agregarás luego otras funciones como createProducto, que seguirán el mismo patrón

export const createProducto = async (req, res) => {
  try {
    const tenantConnection = req.tenantDbConnection;
    const Producto = defineProductoModel(tenantConnection);
    
    const newProduct = await Producto.create(req.body);

    // --- CORRECCIÓN DE LA LÓGICA DEL WEBSOCKET ---
    const io = req.app.get('io');
    // Usamos el subdominio que el middleware ya extrajo por nosotros
    const subdomain = req.subdomain; // <-- CORREGIDO
    const tenantRoom = `tenant_${subdomain}`;

    // Ahora el evento se emite a la sala correcta (ej: 'tenant_cofy-chavez')
    io.to(tenantRoom).emit('nuevo_producto', newProduct);
    console.log(`Emitido evento 'nuevo_producto' a la sala ${tenantRoom}`); // Este log ahora mostrará la sala correcta
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantConnection = req.tenantDbConnection;
    const Producto = defineProductoModel(tenantConnection);

    const product = await Producto.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Actualiza el producto con los datos del body
    const updatedProduct = await product.update(req.body);

    // Emite el evento de actualización a la sala del inquilino
    const io = req.app.get('io');
    const subdomain = req.subdomain;
    const tenantRoom = `tenant_${subdomain}`;
    io.to(tenantRoom).emit('producto_actualizado', updatedProduct);
    console.log(`Emitido evento 'producto_actualizado' a la sala ${tenantRoom}`);

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};