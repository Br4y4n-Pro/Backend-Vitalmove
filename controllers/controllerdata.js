// Aqui se maneja las respuestas de html .res y sus codigos como el 400 etc

// PARA EL LOGIN VA A SER DOS PARAMETROS PERO SE PASARAN POR UN JSON BODY DONDE CONTENDRFA LA CONTRASEÑA Y EL USUARIO ES DECIR DNI HECHO

// PARA EL BUSCADOR SE VA A DAR DOS PARAMETROS DNI Y NOMBRE Y VA A SER UNA QUERY PARA MAS RAPIDEZ
import { query } from "express";
import { uploadImagenS3Model } from "../models/s3.js";
import {
  addUserModel,
  loginUserModel,
  getAllUsersModel,
  deleteUserModel,
  updateUserModel,
  getUserInfoModel,
} from "../models/vitalMoveModel.js";

export const addUserNew = async (req, res) => {
  console.log("Recibiendo solicitud POST en addUserNew");
  const body = req.body;
  if (!req.file) {
    return res
      .status(400)
      .json({ mensaje: "No se ha seleccionado ningún archivo." });
  }

  const urlImagen = await uploadImagenS3Model(req.file);

  try {
    const newUser = await addUserModel(body, urlImagen);
    console.log(`este es el controlador y lo que obtuvo del modelo es`);
    console.log(newUser);

    if (newUser === null) {
      res.status(401).json({ error: "No se pudo crear el usuario" });
    }
    if (newUser instanceof Error) {
      res.status(401).json({ error: newUser.message });
    } else {
      res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

export const loginUser = async (req, res) => {
  const body = req.body; // DNI Y CONTRASENA
  console.log(body);
  try {
    const result = await loginUserModel(body);
    console.log("controlador: ", result);
    if (result.rp == "no") {
      // console.log("result .rp dio no entonces entra por esta linea ");
      return res.status(200).json(result);
    }
    if (result instanceof Error) {
      return res.status(401).json({ error: result.message });
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    // Captura cualquier error que ocurra en loginUserModel y envía una respuesta adecuada
    console.error("Error al iniciar sesión:", error.message);
    res.status(500).json({ error: error.message });
  }
};
//SEARCH USER DE UN SOLO USUARIO Y ESTE ESTA VINCULADO A EL LOGIN DIRECTAMENTE NO ES EL BUSCADOR
export const getUserInfo = async (req, res) => {
  try {
    const { dni } = req.body;
    const userData = await getUserInfoModel(dni);
    console.log(userData);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error al traer los datos:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const allUser = async (req, res) => {
  try {
    const allUserData = await getAllUsersModel();
    res.status(200).json(allUserData);
  } catch (error) {
    console.error("Error al traer los datos:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const { dni } = req.body;
  const result = await deleteUserModel(dni);
  if (result instanceof Error) {
    res.status(401).json({ error: result.message });
  } else {
    res.status(200).json(result);
  }
};
export const updateUser = async (req, res) => {
  const body = req.body;

  try {
    const dataNew = await updateUserModel(body);
    if (dataNew.rowCount === 1) {
      res
        .status(201)
        .json({ message: "Se actualizo exitosamente", data: body });
    } else {
      res.status(401).json({
        message:
          "No se pudo actualizar el usuario verifica la informacion y hazlo nuevamente",
      });
    }
  } catch (error) {
    console.error("Error al traer los datos:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    const result = await searchUserModel(query);
    if (result instanceof Error) {
      res.status(401).json({ error: result.message });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error al traer los datos:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const prueba = async (req, res) => {
  const urlImagen = await uploadImagenS3Model(req.file);

  res.status(200).json({ url: urlImagen });
};
