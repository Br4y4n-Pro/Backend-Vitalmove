import { caminataOnePersonModel, getAllCaminataTestsModels, mesRealizoModel, notasDiariasModel } from "../models/testVItalMoveModel.js";

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


export const mesRealizo = async (req,res)=>{
  const resp = await mesRealizoModel(req.params.id);
  console.log(resp)
  return res.status(200).json(resp);

};

export const notasDiarias = async (req,res) =>{
  try {
    const resp =  await notasDiariasModel(req.params.id);
      return res.status(200).json(resp)
  } catch (error) {
    throw error
  }
  
}