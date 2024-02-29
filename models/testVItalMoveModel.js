import dotenv from "dotenv";
import pkg from "pg";
import { CONFIG_DB } from "../config/db.js";

// Configurar variables de entorno desde el archivo .env
dotenv.config();

const { Pool } = pkg;
const pool = new Pool(CONFIG_DB);

export const crearTestCaminataModel = async (data) => {
  const { fcr, tiempo, distancia, fcm } = data;
  let barevodos = "";

  // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
  console.log("Modelo", data);

  const Consumov = (0.1 * (distancia / tiempo) + 3.5).toFixed(2);
  // console.log(Consumov);
  if (Consumov <= 10.99) {
    // console.log("aqui");
    barevodos = "Bajo";
  } else if (Consumov >= 16.01) {
    // console.log("aca");
    barevodos = "excelente";
  } else {
    // console.log("DONDE ");
    barevodos = "Bueno";
  }
  console.log(barevodos);
  const query =
    "INSERT INTO caminata (fcr, tiempo, distancia, fcm, consumovo2,barevodos) VALUES ($1, $2, $3, $4,$5,$6)";
  const values = [fcr, tiempo, distancia, fcm, Consumov, barevodos];
  console.log(fcr, tiempo, distancia, fcm, Consumov, barevodos);
  const res = await pool.query(query, values);
  console.log("res  em modelo", res);
  return res;
};

export const getAllCaminataTestsModels = async () => {
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
};
