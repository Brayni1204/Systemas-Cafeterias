// backend/src/api/models/Superadmin.js
import { DataTypes } from 'sequelize';
import { mainSequelize } from '../../config/database.js'; // Usa la conexión principal
import bcrypt from 'bcryptjs';

const Superadmin = mainSequelize.define('Superadmin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'superadmins',
  timestamps: true,
  // Hook para encriptar la contraseña, igual que con los usuarios normales
  hooks: {
    beforeCreate: async (superadmin) => {
      if (superadmin.password) {
        const salt = await bcrypt.genSalt(10);
        superadmin.password = await bcrypt.hash(superadmin.password, salt);
      }
    },
  },
});

export default Superadmin;