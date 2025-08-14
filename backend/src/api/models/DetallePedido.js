import { DataTypes } from "sequelize";

export const defineDetallePedidoModel = (sequelize) => {
  const DetallePedido = sequelize.define(
    "DetallePedido",
    {
      id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_pedido: { type: DataTypes.INTEGER, allowNull: false },
      id_producto: { type: DataTypes.INTEGER, allowNull: false },
      cantidad: { type: DataTypes.INTEGER, allowNull: false },
      precio_unitario: { type: DataTypes.FLOAT, allowNull: false },
    },
    { tableName: "detalle_pedidos", timestamps: true }
  );

  DetallePedido.associate = (models) => {
    DetallePedido.belongsTo(models.Pedido, { foreignKey: "id_pedido" });
    DetallePedido.belongsTo(models.Producto, { foreignKey: "id_producto" });
  };
  return DetallePedido;
};
