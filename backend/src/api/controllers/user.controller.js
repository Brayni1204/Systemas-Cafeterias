// backend/src/api/controllers/user.controller.js
/* import defineUserModel from "../models/Usuario.js"; */
import { defineUserModel } from "../models/Usuario.js"; // <-- Cambiado a importación nombrada

export const getUsers = async (req, res) => {
  try {
    const { User } = req.tenantModels; // <-- Accede al modelo User desde req.tenantModels
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { User } = req.tenantModels; // <-- Accede al modelo User desde req.tenantModels
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { User } = req.tenantModels; // <-- Accede al modelo User desde req.tenantModels
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { User } = req.tenantModels; // <-- Accede al modelo User desde req.tenantModels
    const { id } = req.params;
    const [updatedRows] = await User.update(req.body, {
      where: { id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { User } = req.tenantModels; // <-- Accede al modelo User desde req.tenantModels
    const { id } = req.params;
    const deletedRows = await User.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.status(204).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
