import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

export const defineUserModel = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM("administrador", "cajero", "cocinero"),
        allowNull: false,
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.password) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          }
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          }
        },
      },
    }
  );

  return Usuario;
};
