import {
  BruceOnePersonModel,
  allRecomendacionesModel,
  caminataOnePersonModel,
  getAllBruceTestsModels,
  getAllCaminataTestsModels,
  mesRealizoModel,
  notasDiariasModel,
  recomendacionesOneUserModel,
} from "../models/testVItalMoveModel.js";

export const getAllCaminataTests = async (req, res) => {
  try {
    const allCaminatasData = await getAllCaminataTestsModels();
    res.status(200).json(allCaminatasData);
  } catch (error) {
    return res.status(203).json({
      mensaje: "Error al traer todos las caminatas: ",
      rp: "no",
    });
  }
};

export const getAllBruceTests = async (req, res) => {
  try {
    const allBruceData = await getAllBruceTestsModels();
    res.status(200).json(allBruceData);
  } catch (error) {
    return res.status(203).json({
      mensaje: "Error al traer todos los test de Bruces: ",
      rp: "no",
    });
  }
};

export const caminataOnePerson = async (req, res) => {
  const idpersona = req.params.id;
  console.log(idpersona);
  try {
    const caminataOne = await caminataOnePersonModel(idpersona);
    res.status(200).json(caminataOne);
  } catch (e) {
    res.status(500).json({ mensaje: "Error del servidor", error: e });
  }
};

export const BruceOnePerson = async (req, res) => {
  const idpersona = req.params.id;
  console.log(idpersona);
  try {
    const bruceOne = await BruceOnePersonModel(idpersona);
    res.status(200).json(bruceOne);
  } catch (e) {
    res.status(500).json({ mensaje: "Error del servidor", error: e });
  }
};

export const mesRealizo = async (req, res) => {
  const resp = await mesRealizoModel(req.params.id);
  console.log(resp);
  return res.status(200).json(resp);
};

export const notasDiarias = async (req, res) => {
  try {
    const resp = await notasDiariasModel(req.params.id);
    return res.status(200).json(resp);
  } catch (error) {
    throw error;
  }
};

export const allRecomendaciones = async (req, res) => {
  console.log("ENtro a recomendaciones");
  const response = await allRecomendacionesModel();

  try {
    res.status(200).json(response);
  } catch (error) {
    return res.status(203).json({
      mensaje: "Error al traer todas las recomendaciones: ",
      rp: "no",
    });
  }
};

export const recomendacionesOneUser = async (req, res) => {
  const response = await recomendacionesOneUserModel(req.params.id);
  console.log(response);
  if (response === undefined) {
    res.status(200).json({
      mensaje: "No se encuentra ninguna recomendación con ese id de test",
    });
  }
  try {
    res.status(200).json(response);
  } catch (error) {
    return res.status(203).json({
      mensaje: "Error al traer la recomendación del usuario: ",
      rp: "no",
    });
  }
};
