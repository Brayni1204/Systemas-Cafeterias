// backend/src/api/controllers/producto.controller.js

// Ya no necesitamos importar defineProductoModel directamente aquí,
// ya que el modelo se adjunta a req.tenantModels en el middleware.

// Obtener todos los productos para el inquilino actual
export const getProductos = async (req, res) => {
  try {
    // Accedemos al modelo Producto desde req.tenantModels
    const { Producto } = req.tenantModels;

    // Usamos el modelo para buscar todos los productos en la BD de ese inquilino
    const productos = await Producto.findAll();

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  try {
    // Accedemos al modelo Producto desde req.tenantModels
    const { Producto } = req.tenantModels;

    const newProduct = await Producto.create(req.body);

    // Lógica de WebSockets: Emite el evento a la sala del inquilino
    const io = req.app.get("io");
    // El subdominio ya está disponible en req.subdomain gracias al middleware
    const subdomain = req.subdomain;
    const tenantRoom = `tenant_${subdomain}`;

    // Ahora el evento se emite a la sala correcta (ej: 'tenant_cofy-chavez')
    io.to(tenantRoom).emit("nuevo_producto", newProduct);
    console.log(`Emitido evento 'nuevo_producto' a la sala ${tenantRoom}`);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res
      .status(500)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    // Accedemos al modelo Producto desde req.tenantModels
    const { Producto } = req.tenantModels;
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    // Accedemos al modelo Producto desde req.tenantModels
    const { Producto } = req.tenantModels;

    const product = await Producto.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Actualiza el producto con los datos del body
    const updatedProduct = await product.update(req.body);

    // Emite el evento de actualización a la sala del inquilino
    const io = req.app.get("io");
    const subdomain = req.subdomain;
    const tenantRoom = `tenant_${subdomain}`;
    io.to(tenantRoom).emit("producto_actualizado", updatedProduct);
    console.log(
      `Emitido evento 'producto_actualizado' a la sala ${tenantRoom}`
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    // Accedemos al modelo Producto desde req.tenantModels
    const { Producto } = req.tenantModels;
    const { id } = req.params;
    const deletedRows = await Producto.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }
    res.status(204).json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
