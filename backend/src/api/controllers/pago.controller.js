import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";
import { getTenantConnection } from "../../config/database.js";
import { definePedidoModel } from "../models/Pedido.js";

dotenv.config();

// 1. Se crea un cliente de Mercado Pago con tus credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const crearPreferenciaPago = async (req, res) => {
  const { Pedido, Cliente } = req.tenantModels;
  const { id_pedido } = req.body;

  try {
    const pedido = await Pedido.findByPk(id_pedido, { include: [Cliente] });
    if (!pedido || pedido.estado_pago === "pagado") {
      return res
        .status(404)
        .json({ message: "Pedido no válido o ya fue pagado." });
    }

    // 2. Se crea una instancia de 'Preference' usando el cliente
    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          title: `Pedido #${pedido.id_pedido} para ${pedido.Cliente.nombres}`,
          description: `Consumo en ${req.tenant.companyName}`,
          quantity: 1,
          unit_price: pedido.total,
          currency_id: "PEN",
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago/exitoso`,
        failure: `${process.env.FRONTEND_URL}/pago/fallido`,
        pending: `${process.env.FRONTEND_URL}/pago/pendiente`,
      },
      auto_return: "approved",
      external_reference: pedido.id_pedido.toString(),
      notification_url: `${process.env.BACKEND_URL}/api/v1/pagos/webhook?tenant=${req.subdomain}`,
    };

    // 3. Se crea la preferencia usando la nueva sintaxis
    const result = await preference.create({ body: preferenceData });

    res.json({ preferenceId: result.id });
  } catch (error) {
    console.error("Error al crear preferencia de Mercado Pago:", error);
    res.status(500).json({ message: "Error al iniciar el pago." });
  }
};

export const recibirWebhook = async (req, res) => {
  const { tenant } = req.query;
  const { type, data } = req.body;

  if (type === "payment") {
    try {
      // 4. Se crea una instancia de 'Payment' para buscar la información del pago
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: data.id });

      const id_pedido = parseInt(paymentInfo.external_reference);
      const tenantDbName = `tenant_${tenant.replace(/-/g, "_")}`;
      const tenantConnection = getTenantConnection(tenantDbName);
      const { Pedido } = defineModelsForTenant(tenantConnection); // Usamos una función helper

      const pedido = await Pedido.findByPk(id_pedido);

      if (pedido && paymentInfo.status === "approved") {
        pedido.estado_pago = "pagado";
        pedido.metodo_pago = paymentInfo.payment_method_id;
        pedido.id_pago_externo = paymentInfo.id.toString();
        await pedido.save();
        console.log(
          `Pedido ${id_pedido} del tenant ${tenant} pagado exitosamente.`
        );
        // Aquí podrías emitir un evento de WebSocket si lo necesitas
      }
    } catch (error) {
      console.error("Error en webhook de Mercado Pago:", error);
    }
  }
  res.sendStatus(200);
};

// Función helper para definir modelos necesarios en el webhook
const defineModelsForTenant = (connection) => {
  const Pedido = definePedidoModel(connection);
  // Si necesitaras otros modelos, los defines aquí
  return { Pedido };
};
