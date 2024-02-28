// import dotenv from "dotenv";
// dotenv.config();
// import pkg from "pg";
// const { Pool } = pkg;
// import { CONFIG_DB } from "../config/db.js";
// const pool = new Pool(CONFIG_DB);

// export const crearTestCaminataModel =(data) => {

//     // pool.query('INSERT INTO caminatas (fcr, tiempo, distancia, fcm) VALUES ($1, $2, $3, $4)', [data.FCR, data.TIEMPO, data.DISTANCIA, data.FCM], (err, result) => {
//     //         if (err) {
//     //             console.error('Error al insertar en la base de datos:', err);
//     //         } else {
//     //             console.log('Datos insertados correctamente:', result.rows);
//     //         }

//             const query = 'INSERT INTO caminatas (fcr, tiempo, distancia, fcm) VALUES ($1, $2, $3, $4)';
//             const values = [data.FCR, data.TIEMPO, data.DISTANCIA, data.FCM];

//             return pool.query(query, values);
//         };

import dotenv from "dotenv";
import pkg from "pg";
import { CONFIG_DB } from "../config/db.js";

// Configurar variables de entorno desde el archivo .env
dotenv.config();

const { Pool } = pkg;
const pool = new Pool(CONFIG_DB);

export const crearTestCaminataModel = (data) => {
  // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
  const query =
    "INSERT INTO caminatas (fcr, tiempo, distancia, fcm) VALUES ($1, $2, $3, $4)";
  const values = [data.FCR, data.TIEMPO, data.DISTANCIA, data.FCM];

  return pool.query(query, values);
};
