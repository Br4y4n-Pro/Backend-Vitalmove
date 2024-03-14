import {
  crearTestBruceModModel,
  crearTestCaminataModel,
  registroRecomendacionModel,
  registroTestModel,
} from "../models/testVItalMoveModel.js";

export const crearCaminata = async (req, res) => {
  try {
    // console.log(req.body);

    const caminatadata = await crearTestCaminataModel(req.body);

    const idcaminata = caminatadata.rows[0].idcaminata;
    const { idusuario } = req.body;

    console.log("ca", idcaminata, idusuario);

    const registronTests = await registroTestModel(idcaminata, idusuario);
    console.log(registronTests, "esto es idtests");

    console.log(req.body.descripcion, registronTests);
    await registroRecomendacionModel(registronTests, req.body.descripcion);

    if (caminatadata.rowCount === 1) {
      res
        .status(200)
        .json({ ...req.body, rp: "si", mensaje: "Registro de test exitoso" });
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

export const crearTestBruce = async (req, res) => {
  // console.log("Recibiendo solicitud POST en bruce");

  const body = req.body;

  // console.log("Este es el body", body);
  // hasta awui llega todo bien
  try {
    const newtestB = await crearTestBruceModModel(body);
    // console.log(newtestB);

    console.log(`este es el controlador y lo que obtuvo del modelo es`);

    if (newtestB === null) {
      res
        .status(401)
        .json({ error: "No se pudo crear el test bruce ", rp: "no" });
    }
    if (newtestB instanceof Error) {
      res.status(401).json({ error: newtestB.message });
    } else {
      res
        .status(201)
        .json({ mensaje: "test bruce  registrado exitosamente", rp: "si" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor", error: error });
  }
};
