export const createCliente = async (req, res) => {
  const { Cliente } = req.tenantModels;
  try {
    const nuevoCliente = await Cliente.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el cliente", error: error.message });
  }
};

export const getClientes = async (req, res) => {
  const { Cliente } = req.tenantModels;
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los clientes", error: error.message });
  }
};
