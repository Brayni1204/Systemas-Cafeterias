// backend/src/api/models/Producto.js
import { DataTypes } from 'sequelize';

// Convertimos el modelo en una función que define y devuelve el modelo Producto
export const defineProductoModel = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.ENUM('cafetería', 'restaurante', 'minimarket'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'disponible',
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: 'productos',
    timestamps: true,
  });

  return Producto;
};