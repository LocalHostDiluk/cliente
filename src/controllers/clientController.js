import Client from "../models/clientModel.js";

export const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).json({ message: "Error al listar clientes" });
  }
};

export const createClient = async (req, res) => {
  const { name, mail, phone, lastname, birthdate, address } = req.body;

  if (!name || !mail || !phone || !lastname || !birthdate || !address) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const existingClient = await Client.findOne({ where: { mail } });
    if (existingClient) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const existingPhone = await Client.findOne({ where: { phone } });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "El teléfono ya está registrado" });
    }
  } catch (error) {
    console.error("Error al verificar correo o teléfono:", error);
    return res
      .status(500)
      .json({ message: "Error al verificar correo o teléfono" });
  }

  function isValidEmail(mail) {
    if (typeof mail !== "string" || mail.trim() === "") {
      return false;
    }
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return mailRegex.test(mail);
  }

  if (!isValidEmail(mail)) {
    return res.status(400).json({ message: "Correo no válido" });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res
      .status(400)
      .json({ message: "El teléfono debe tener 10 dígitos" });
  }

  try {
    const newClient = await Client.create({
      name,
      mail,
      phone,
      lastname,
      birthdate,
      address,
      status: true,
      creationDate: new Date(),
    });

    console.log(newClient);
    
    return res
      .status(201)
      .json({ message: "Cliente creado exitosamente", data: newClient });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return res.status(500).json({ message: "Error al crear cliente" });
  }
};

export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, mail, phone, address, lastname } = req.body;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (mail) {
      const existingMail = await Client.findOne({ where: { mail } });
      if (existingMail) {
        return res
          .status(400)
          .json({ message: "El correo ya está registrado" });
      }
    }

    if (phone) {
      const existingPhone = await Client.findOne({ where: { phone } });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "El teléfono ya está registrado" });
      }
    }

    await client.update({
      name: name || client.name,
      mail: mail || client.mail,
      phone: phone || client.phone,
      address: address || client.address,
      lastname: lastname || client.lastname,
    });

    return res
      .status(200)
      .json({ message: "Cliente actualizado correctamente", data: client });
  } catch (error) {
    console.error("Error al buscar cliente:", error);
    return res.status(500).json({ message: "Error al buscar cliente" });
  }
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(400).json({ message: "Cliente no encontrado" });
    }

    if (!client.status) {
      return res.status(400).json({ message: "Cliente ya eliminado" });
    }

    await client.update({
      status: false,
    });

    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar cliente" });
  }
};
