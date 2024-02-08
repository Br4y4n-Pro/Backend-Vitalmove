// Aqui se maneja las respuestas de html .res y sus codigos como el 400 etc


// PARA EL LOGIN VA A SER DOS PARAMETROS PERO SE PASARAN POR UN JSON BODY DONDE CONTENDRFA LA CONTRASEÑA Y EL USUARIO ES DECIR DNI HECHO

// PARA EL BUSCADOR SE VA A DAR DOS PARAMETROS DNI Y NOMBRE Y VA A SER UNA QUERY PARA MAS RAPIDEZ
import { addUSerModel, loginUSerModel, searchUserModel } from "../models/vitalMoveModel.js";

export const addUserNew = async (req, res) => {
    console.log('Recibiendo solicitud POST en addUserNew');
   const body =  req.body;
   const fileImagen =  req.file;
    try {

      const newUser = await addUSerModel(body , fileImagen);
      console.log(`este es el controlador y lo que obtuvo del modelo es`);
      console.log(newUser);

      if (newUser instanceof Error) {
        res.status(401).json({  error: newUser.message });
      } else {
        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
      }
    } catch (error) {
      res.status(500).json({ mensaje: "Error del servidor" });
    }
  };

  export const loginUser = async (req, res, next) => {
    const body = req.body;

    try {
        const result = await loginUSerModel(body);
        if (result instanceof Error) {
           return res.status(401).json({ error: result.message });
        } else {
            // Si el usuario se autentica correctamente, puedes continuar con el siguiente middleware
            next();
        }
    } catch (error) {
        // Captura cualquier error que ocurra en loginUserModel y envía una respuesta adecuada
        console.error("Error al iniciar sesión:", error.message);
        res.status(500).json({ error: error.message });
    }
};


  //SEARCH USER DE UN SOLO USUARIO Y ESTE ESTA VINCULADO A EL LOGIN DIRECTAMENTE NO ES EL BUSCADOR 
  export const searchUser = async ( req, res) =>{
    try {
      const {dni}  = req.body
      const userData = await searchUserModel( dni );
        res.status(200).json(userData)
      
    } catch (error) {
      console.error("Error al traer los datos:", error.message);
      res.status(500).json({ error: error.message });
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