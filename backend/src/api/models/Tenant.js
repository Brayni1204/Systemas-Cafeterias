// backend/src/api/models/Tenant.js
import { DataTypes } from 'sequelize';
import { mainSequelize } from '../../config/database.js';

const Tenant = mainSequelize.define('Tenant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // --- AÑADIMOS ESTE CAMPO ---
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subdomain: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  dbName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  tableName: 'tenants',
  timestamps: true,
});

export default Tenant;