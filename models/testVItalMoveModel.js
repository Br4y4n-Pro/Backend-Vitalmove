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

  const res = await pool.query(query, values);
  console.log("res  em modelo", res);
  return res;
};
