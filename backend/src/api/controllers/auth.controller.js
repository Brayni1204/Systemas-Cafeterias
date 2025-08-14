// backend/src/api/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Ya no necesitas la siguiente línea, puedes borrarla.
// import { defineUserModel } from "../models/Usuario.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { Usuario } = req.tenantModels;
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Credenciales incorrectas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas." });
    }

    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    const payload = {
      id: user.id_usuario, // Cambia 'user.id' a 'user.id_usuario'
      rol: user.rol,
      tenantId: req.tenant.id,
    };
    // --- FIN DE LA CORRECCIÓN ---

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
