import { DataTypes } from "sequelize";

export const definePedidoModel = (sequelize) => {
  const Pedido = sequelize.define(
    "Pedido",
    {
      id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      id_cliente: { type: DataTypes.INTEGER, allowNull: false },
      total: { type: DataTypes.FLOAT, allowNull: false },
      estado: {
        type: DataTypes.ENUM(
          "pendiente",
          "preparando",
          "listo",
          "entregado",
          "cancelado"
        ),
        defaultValue: "pendiente",
      },
      estado_pago: {
        type: DataTypes.ENUM(
          "pendiente", // Aún no se ha pagado
          "pagado", // El pago fue exitoso
          "fallido" // El pago fue rechazado
        ),
        allowNull: false,
        defaultValue: "pendiente",
      },
      metodo_pago: {
        type: DataTypes.STRING, // Aquí guardaremos 'yape', 'tarjeta_credito', 'plin', etc.
        allowNull: true,
      },
      id_pago_externo: {
        type: DataTypes.STRING, // El ID que nos devuelve la pasarela (ej. Mercado Pago)
        allowNull: true,
      },
    },
    { tableName: "pedidos", timestamps: true }
  );

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
    Pedido.belongsTo(models.Cliente, { foreignKey: "id_cliente" });
    Pedido.hasMany(models.DetallePedido, { foreignKey: "id_pedido" });
  };
  return Pedido;
};
