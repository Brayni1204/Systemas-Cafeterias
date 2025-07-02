// backend/src/api/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { defineUserModel } from '../models/Usuario.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Obtener la conexión del inquilino desde el middleware
    const tenantConnection = req.tenantDbConnection;
    if (!tenantConnection) {
        return res.status(500).json({ message: "La conexión con la empresa no está disponible." });
    }

    // 2. Definir el modelo Usuario en la base de datos de ESE inquilino
    const Usuario = defineUserModel(tenantConnection);

    // 3. Buscar al usuario por su email en la base de datos del inquilino
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // 4. Comparar la contraseña enviada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    // 5. Crear el payload para el token (los datos que queremos guardar en él)
    const payload = {
      id: user.id_usuario,
      nombre: user.nombre,
      rol: user.rol,
      companyName: req.tenant.companyName,
    };

    // 6. Firmar el token con el secreto y enviarlo de vuelta
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // El token expira en 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};