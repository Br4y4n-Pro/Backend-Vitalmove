export const crearCaminata = async (req, res) => {
  console.log(req.body);

  if (
    req.body.FCR == "" ||
    req.body.TIEMPO == "" ||
    req.body.DISTANCIA == "" ||
    req.body.FCM == ""
  ) {
    console.log(`Llegó vacío`);

    return res.status(400).json({
      mensaje: "Alguno de los campos está vacío",
      rp: "no",
    });
  }

  try {
    const result = await crearTestCaminataModel(req.body);
    console.log("Controlador:", result);
    if (result.rp == "no") {
      return res.status(200).json(result);
    }
    if (result instanceof Error) {
      return res.status(401).json({ error: result.message });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    // Captura cualquier error que ocurra en crearTestCaminataModel y envía una respuesta adecuada
    return res.status(203).json({
      mensaje: "Error al enviar",
      rp: "no",
    });
  }
};
