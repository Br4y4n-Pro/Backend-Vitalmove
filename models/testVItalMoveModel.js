import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
import { CONFIG_DB } from "../config/db.js";
const pool = new Pool(CONFIG_DB);



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