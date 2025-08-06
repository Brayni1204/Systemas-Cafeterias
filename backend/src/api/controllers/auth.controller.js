// backend/src/api/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { defineUserModel } from "../models/Usuario.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { User } = req.tenantModels; // <-- Accede al modelo User desde req.tenantModels
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Credenciales incorrectas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas." });
    }

    const payload = {
      id: user.id,
      rol: user.rol,
      tenantId: req.tenant.id, // Opcional: incluir el ID del inquilino en el token
    };

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
