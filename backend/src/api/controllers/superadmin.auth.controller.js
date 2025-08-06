// backend/src/api/controllers/superadmin.auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Superadmin from "../models/Superadmin.js"; // Importa el modelo Superadmin

export const loginSuperadmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca en la tabla 'superadmins' de la BD principal
    const superadmin = await Superadmin.findOne({ where: { email } });
    if (!superadmin) {
      return res.status(404).json({ message: "Credenciales incorrectas." });
    } // --- AGREGA ESTAS LÍNEAS PARA DEPURAR ---

    const isMatch = await bcrypt.compare(password, superadmin.password);
    console.log("Contraseña recibida:", password);
    console.log("Hash en la BD:", superadmin.password);
    console.log("¿Coinciden las contraseñas?", isMatch); // ---------------------------------------
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas." });
    } // El payload del token incluye un rol especial para identificarlo

    const payload = {
      id: superadmin.id,
      rol: "superadmin",
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
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
