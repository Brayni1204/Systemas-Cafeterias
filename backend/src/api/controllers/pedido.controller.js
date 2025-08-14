export const createPedido = async (req, res) => {
  const { Pedido, DetallePedido, Producto, Cliente, sequelize } =
    req.tenantModels;
  const { id_cliente, detalles } = req.body;
  const id_usuario = req.user.id;
  const subdomain = req.subdomain;

  const t = await sequelize.transaction();
  try {
    const cliente = await Cliente.findByPk(id_cliente, { transaction: t });
    if (!cliente) throw new Error(`El cliente con ID ${id_cliente} no existe.`);

    // --- LÍNEAS AGREGADAS ---
    let totalCalculado = 0;
    const detallesParaCrear = [];
    // --- FIN DE LÍNEAS AGREGADAS ---

    const productosActualizados = [];

    await Promise.all(
      detalles.map(async (detalle) => {
        const producto = await Producto.findByPk(detalle.id_producto, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!producto) {
          throw new Error(
            `El producto con ID ${detalle.id_producto} no existe.`
          );
        }
        if (producto.stock < detalle.cantidad) {
          throw new Error(
            `Stock insuficiente para: ${producto.nombre}. Disponible: ${producto.stock}`
          );
        }

        producto.stock -= detalle.cantidad;
        await producto.save({ transaction: t });

        // --- LÓGICA DE CÁLCULO AGREGADA ---
        totalCalculado += producto.precio * detalle.cantidad;
        detallesParaCrear.push({
          id_producto: detalle.id_producto,
          cantidad: detalle.cantidad,
          precio_unitario: producto.precio,
        });
        // --- FIN DE LÓGICA DE CÁLCULO ---

        productosActualizados.push({
          id_producto: producto.id_producto,
          stock: producto.stock,
        });
      })
    );

    const nuevoPedido = await Pedido.create(
      // Ahora 'totalCalculado' sí existe
      { id_usuario, id_cliente, total: totalCalculado },
      { transaction: t }
    );

    const detallesConId = detallesParaCrear.map((d) => ({
      ...d,
      id_pedido: nuevoPedido.id_pedido,
    }));

    await DetallePedido.bulkCreate(detallesConId, { transaction: t });

    await t.commit();

    const io = req.app.get("io");
    const tenantRoom = `tenant_${subdomain}`;
    io.to(tenantRoom).emit("stock_actualizado", productosActualizados);
    console.log(`Emitido evento 'stock_actualizado' a la sala ${tenantRoom}`);

    const pedidoCreado = await Pedido.findByPk(nuevoPedido.id_pedido, {
      include: [{ all: true, nested: true }],
    });

    res.status(201).json(pedidoCreado);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};
