const express = require("express");
const cors = require("cors");

const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: "TEST-4701578864610818-050919-f748362d88c109e094ffee9536ca71c7-471497455"
});

app.post("/crear-preferencia", async (req, res) => {

  try {

    const carrito = req.body.items;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: carrito.map(p => ({
          title: p.nombre,
          quantity: Number(p.cantidad),
          currency_id: "UYU",
          unit_price: Number(p.precio)
        }))
      }
    });

    res.json({
      init_point: response.init_point
    });

  } catch(error){

    console.log(error);

    res.status(500).json({
      error: "Error Mercado Pago"
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en puerto 3000");
});
