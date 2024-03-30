import {
  crearTestBruceModModel,
  crearTestCaminataModel,
  registroRecomendacionModel,
  registroTestModel,
  regisTestModel,
  getAllPublicacionesModel,
  crearPublicacionModel,
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
    if (req.body.descripcion !== "") {
      await registroRecomendacionModel(registronTests, req.body.descripcion);
    }
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
  try {
    const newtestB = await crearTestBruceModModel(req.body);

    const idetapa = newtestB.rows[0].idetapa;

    const { idusuario } = req.body;

    // console.log("bruce ", idetapa, idusuario);

    const registronTests = await regisTestModel(idetapa, idusuario);
    console.log(registronTests, "esto es idtests");

    console.log(req.body.descripcion, registronTests);
    if (req.body.descripcion !== "") {
      await registroRecomendacionModel(registronTests, req.body.descripcion);
    }
    console.log("Continuo bien");

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


export const getAllPublicaciones = async (req,res)=>{
  try {
    const publicaciones = await getAllPublicacionesModel()
    console.log(publicaciones)
    if (publicaciones.rowCount === 0) {
     return res.status(200).json({mensaje: 'No hay ninguna Publicación'})
    }
   return res.status(200).json(publicaciones.rows)

  } catch (error) {
   throw error
  
  }

}

export const crearPublicacion = (req,res) =>{
  const body = req.body
  const imagen = req.file
  console.log(req.body);
  console.log(req.file);
  const nuevaPublicacion = crearPublicacionModel(body,imagen)
  try {
    


  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor", error: error });

  }
}