import { crearTestCaminataModel } from "../models/testVItalMoveModel.js";

export const crearCaminata = async (req, res) => {
  try {
    // console.log(req.body);

    const caminatadata = await crearTestCaminataModel(req.body);

    console.log("ca", caminatadata.rows);

    if (caminatadata.rowCount === 1) {
      res.status(200).json({ ...req.body, rp: "si" });
    } else {
      res.status(203).json({
        mensaje: "Error no se pudo ingresar el test",
        rp: "no",
      });
    }
  } catch (error) {
    return res.status(203).json({
      mensaje: "Error en la BD ",
      rp: "no",
    });
  }
};
