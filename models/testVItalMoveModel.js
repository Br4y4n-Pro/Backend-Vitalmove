import dotenv from "dotenv";
import pkg from "pg";
import { CONFIG_DB } from "../config/db.js";

// Configurar variables de entorno desde el archivo .env
dotenv.config();

const { Pool } = pkg;
const pool = new Pool(CONFIG_DB);

export const crearTestCaminataModel = async (data) => {
  const {
    fcr,
    tiempo,
    distancia,
    consumovo2,
    barevodos,
    fcm,
    descripcionvodos,
  } = data;
  // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
  console.log("Modelo", data);
  const query =
    "INSERT INTO caminata (fcr, tiempo, distancia, fcm, consumovo2,barevodos,descripcionvodos) VALUES ($1, $2, $3, $4,$5,$6,$7)";
  const values = [
    fcr,
    tiempo,
    distancia,
    fcm,
    consumovo2,
    barevodos,
    descripcionvodos,
  ];

<<<<<<< HEAD
  const res = await pool.query(query, values);
  console.log("res  em modelo", res);
  return res;
};
=======

// export const crearTestCaminataModel =(data) => {

//     cvodos = 20 
//     if

// }




export const getAllCaminataTestsModels = async ( ) => {

try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const allCaminataTest = await client.query("SELECT * FROM caminata");
      const dataAllCaminataTest = {
        cantidad: allCaminataTest.rowCount,
        datos: allCaminataTest.rows,
      }; //<--- devuelve un array de objetos (Usuarios) :D
    //   console.log(allCaminataTest);

      return dataAllCaminataTest;
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
    return res.status(200).json({
      mensaje: "Error al obtener todos los Tests de Caminata",
      rp: "no",
    });
  }
}
>>>>>>> 621345c1a5ccccf5623c0cc45c5eb4046336a878
