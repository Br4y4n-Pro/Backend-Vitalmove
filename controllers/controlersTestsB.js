import { getAllCaminataTestsModels } from "../models/testVItalMoveModel.js";

export const getAllCaminataTests = async (req,res)=>{
    try {
        const allUserData = await getAllCaminataTestsModels();
        res.status(200).json(allUserData);
      } catch (error) {
        return res.status(203).json({
          mensaje: "Error al traer todos los usuarios: ",
          rp: "no",
        });
      }
}