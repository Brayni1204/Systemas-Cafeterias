import { DataTypes } from "sequelize";

export const defineClienteModel = (sequelize) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo_documento: { type: DataTypes.ENUM("DNI", "RUC"), allowNull: false },
      numero_documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nombres: { type: DataTypes.STRING, allowNull: false },
      razon_social: { type: DataTypes.STRING },
      direccion: { type: DataTypes.STRING },
    },
    { tableName: "clientes", timestamps: true }
  );

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Pedido, { foreignKey: "id_cliente" });
  };
  return Cliente;
};
