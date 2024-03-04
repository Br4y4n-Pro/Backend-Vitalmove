import { caminataOnePersonModel, getAllCaminataTestsModels } from "../models/testVItalMoveModel.js";

export const getAllCaminataTests = async (req, res) => {
  try {
    const allUserData = await getAllCaminataTestsModels();
    res.status(200).json(allUserData);
  } catch (error) {
    return res.status(203).json({
      mensaje: "Error al traer todos los usuarios: ",
      rp: "no",
    });
  }
};

export const caminataOnePerson = async (req,res) => {
  const idpersona = req.params.id;
  console.log(idpersona)
  try {
    const caminataOne = await caminataOnePersonModel(idpersona);
    res.status(200).json(caminataOne);
  } catch(e) {
    res
    .status(500)
    .json({ mensaje: "Error del servidor", error:e })
  }
};
