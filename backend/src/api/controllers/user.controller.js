import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const { User } = req.tenantModels;
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { User } = req.tenantModels;
    const { id_usuario } = req.params;
    const user = await User.findByPk(id_usuario);
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
    const { User } = req.tenantModels;
    const newUser = await User.create(req.body);
    const io = req.app.get("io");
    const tenantId = req.headers["x-tenant-id"];
    io.to(`tenant_${tenantId}`).emit("nuevo_usuario", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { User } = req.tenantModels;
    const { id_usuario } = req.params;
    const { nombre, email, password, rol } = req.body;

    const usuario = await User.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await usuario.update({
      nombre,
      email,
      password: password ? bcrypt.hashSync(password, 10) : usuario.password,
      rol,
    });

    const io = req.app.get("io");
    const tenantId = req.headers["x-tenant-id"];
    io.to(`tenant_${tenantId}`).emit("usuario_actualizado", usuario);

    res.json({ message: "Usuario actualizado correctamente", user: usuario });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { User } = req.tenantModels;
    const { id_usuario } = req.params;
    const deletedRows = await User.destroy({
      where: { id_usuario },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const io = req.app.get("io");
    const tenantId = req.headers["x-tenant-id"];
    io.to(`tenant_${tenantId}`).emit("usuario_eliminado", id_usuario);

    res.status(204).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
