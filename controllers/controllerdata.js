// Aqui se maneja las respuestas de html .res y sus codigos como el 400 etc

import { addUSerNewModel } from "../models/vitalMoveModel.js";


export const addUserNew = async (req,res) =>{
    console.log('Recibiendo solicitud POST en addUserNew');
    console.log(res.body)
    try {

        //VALIDAR EXISTENCIA DE USUARIO

        const newUser = addUSerNewModel(req.body);

        if(newUser){
            res
            .status(201)
            .json({ mensaje: "usuario registrado exitosamente" });
        }else{
            res
            .status(401)
            .json({ mensaje: "no se pudo guardar en la base de datos" });
        }

    } catch (error) {
        console.error("Error al agregar Usuario", error);
        res
          .status(500)
          .json({ mensaje: "Error al agregar usuario" });
    }
};

export const principal = (req, res) => {
    res.send('Hola desde la ruta principal');
  }