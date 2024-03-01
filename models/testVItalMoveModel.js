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
    // console.log("DONDE ");|
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

export const crearTestBruceModModel = async (data) => {
  const { etapa, saturacionvodos } = data;

  // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
  // console.log("Modelo", data);
  // console.log(typeof etapa);

  const dt1 = selecionarEtapa(etapa);

  const { velocidad, grados, tiempo, vodos } = dt1;
  // console.log(dt1);

  const query =
    "INSERT INTO etapas (elefinal, velocidadfinal, numeroetapa, vodos, saturacionvodos, tiempo) VALUES ($1, $2, $3, $4, $5, $6)";

  const values = [grados, velocidad, etapa, vodos, saturacionvodos, tiempo];

  const client = await pool.connect(); // Conexión a la base de datos
  // console.log("conecto");
  try {
    const result = await client.query(query, values);
    // console.log("Resultado de la consulta:", result);
    // console.log(result.rowCount, result.rows);
    // Bruce  Creado
    if (result.rowCount === 1) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    // console.error("Error al ejecutar la consulta SQL:", error);

    return res.status(203).json({
      mensaje: "Error al registrar el test",
      rp: "no",
    });
  } finally {
    client.release(); // Liberar cliente de la base de datos
  }
};

const selecionarEtapa = (etapa) => {
  if (etapa == 1) {
    return { velocidad: 2.7, grados: 0, tiempo: 3, vodos: 2.3 };
  }
  if (etapa == 2) {
    return { velocidad: 2.7, grados: 5, tiempo: 3, vodos: 3.5 };
  }
  if (etapa == 3) {
    return { velocidad: 2.7, grados: 10, tiempo: 3, vodos: 4.6 };
  }
  if (etapa == 4) {
    return { velocidad: 4, grados: 12, tiempo: 3, vodos: 7 };
  }
  if (etapa == 5) {
    return { velocidad: 5.4, grados: 14, tiempo: 3, vodos: 10.1 };
  }

  // console.log("sigue");
  if (etapa == 6) {
    return { velocidad: 6.7, grados: 16, tiempo: 3, vodos: 12.9 };
  }
  if (etapa == 7) {
    return { velocidad: 8.0, grados: 18, tiempo: 3, vodos: 15 };
  }
  if (etapa == 8) {
    return { velocidad: 8.8, grados: 20, tiempo: 3, vodos: 16 };
  }
  if (etapa == 9) {
    return { velocidad: 10.5, grados: 22, tiempo: 3, vodos: 19.1 };
  }
};
