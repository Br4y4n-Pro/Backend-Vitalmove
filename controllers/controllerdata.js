// Aqui se maneja las respuestas de html .res y sus codigos como el 400 etc

import { addUSerNewModel } from "../models/vitalMoveModel.js";

export const addUserNew = async (req, res) => {
    console.log('Recibiendo solicitud POST en addUserNew');
   const body =  req.body;
   const fileImagen =  req.file;
    try {

      const newUser = await addUSerNewModel(body , fileImagen);
      console.log(`este es el controlador y lo que obtuvo del modelo es`);
      console.log(body);
      console.log(fileImagen);

      if (newUser instanceof Error) {
        res.status(401).json({  error: newUser.message });
      } else if (newUser) {
        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
      } else {
        res.status(401).json({ error: newUser.message });
      }
    } catch (error) {
      console.error("Error al agregar Usuario", error);
      res.status(500).json({ mensaje: "Error al agregar usuario" });
    }
  };


export const muestra = async (req,res) => {
 const  body = await req.body;
  console.log(body)
  console.log("--------------------------------------")
  const file = await req.file
  console.log(file)
  res.sendStatus(200);
};

export const principal = (req, res) => {
    res.send('Hola desde la ruta principal');
  }