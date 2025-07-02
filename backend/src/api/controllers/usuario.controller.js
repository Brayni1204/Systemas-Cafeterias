import { defineUserModel } from '../models/Usuario.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const Usuario = defineUserModel(req.tenantDbConnection);
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const Usuario = defineUserModel(req.tenantDbConnection);
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const Usuario = defineUserModel(req.tenantDbConnection);
    const { nombre, email, password, rol } = req.body;

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, email, password, rol });

    const { password: _, ...usuarioSinPassword } = usuario.toJSON();
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario: ' + error.message });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const Usuario = defineUserModel(req.tenantDbConnection);
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (email && email !== usuario.email) {
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    // Si se envía una contraseña vacía o nula, no la actualizamos
    const updateData = { nombre, email, rol };
    if (password) {
      updateData.password = password;
    }

    await usuario.update(updateData);
    
    const { password: _, ...usuarioSinPassword } = usuario.toJSON();
    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario: ' + error.message });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const Usuario = defineUserModel(req.tenantDbConnection);
    const usuario = await Usuario.findByPk(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.status(204).send(); // 204 No Content es estándar para delete exitoso
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};