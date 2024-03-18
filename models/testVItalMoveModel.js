import dotenv from "dotenv";
import pkg from "pg";
import { CONFIG_DB } from "../config/db.js";
import { calculoImc, selecionarEtapa } from "../utils/utils.js";
// Configurar variables de entorno desde el archivo .env
dotenv.config();

const { Pool } = pkg;
const pool = new Pool(CONFIG_DB);

export const crearTestCaminataModel = async (data) => {
  const { fcr, tiempo, distancia, fcm } = data;
  // console.log(data);
  let barevodos = "";

  // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
  // console.log("Modelo", data);

  const Consumov = (0.1 * (distancia / tiempo) + 3.5).toFixed(2);
  // console.log(Consumov);
  if (Consumov <= 10.99) {
    // console.log("aqui");
    barevodos = "Bajo";
  } else if (Consumov >= 16.01) {
    // console.log("aca");
    barevodos = "Excelente";
  } else {
    // console.log("DONDE ");|
    barevodos = "Bueno";
  }
  console.log(barevodos);
  const query =
    "INSERT INTO caminata (fcr, tiempo, distancia, fcm, consumovo2,barevodos) VALUES ($1, $2, $3, $4,$5,$6) RETURNING idcaminata";
  const values = [fcr, tiempo, distancia, fcm, Consumov, barevodos];
  console.log(fcr, tiempo, distancia, fcm, Consumov, barevodos);
  const res = await pool.query(query, values);
  // console.log("res  em modelo", res);
  return res;
};

export const registroTestModel = async (idtets, idusuario) => {
  console.log(idtets, idusuario);
  try {
    const query =
      "INSERT INTO tests (fkcaminata,idusuario,fkbruce) VALUES ($1,$2,$3) RETURNING idtest";
    const result = await pool.query(query, [idtets, idusuario]);
    console.log(result.rows[0]);
    return result.rows[0].idtest;
  } catch (e) {
    return { rp: "no", error, mensaje: "Error al insertar en la tabla tests" };
  }
};

export const regisTestModel = async (idtets, idusuario) => {
  console.log(idtets, idusuario);
  try {
    const query =
      "INSERT INTO tests (fkbruce, idusuario) VALUES ($1,$2) RETURNING idtest";
    const result = await pool.query(query, [idtets, idusuario]);
    console.log(result.rows[0]);
    return result.rows[0].idtest;
  } catch (e) {
    return {
      rp: "no",
      error,
      mensaje: "Error al insertar en la tabla tests qwa",
    };
  }
};

export const getAllCaminataTestsModels = async () => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const allCaminataTest = await client.query("SELECT * FROM caminata");

      //   console.log(allCaminataTest);

      return allCaminataTest.rows; //<--- devuelve un array de objetos (Caminatas) :D
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

export const getAllBruceTestsModels = async () => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const allBruceTest = await client.query("SELECT * FROM etapas");

      return allBruceTest.rows;
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

export const caminataOnePersonModel = async (idpersona) => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const caminataUser = await client.query(
        `SELECT t3.idusuario, t2.fecha, t1.fcr, t1.tiempo, t1.distancia, t1.consumovo2, t1.barevodos, t1.fcm 
        FROM tests AS t2 
        JOIN usuario AS t3 ON t2.idusuario = t3.idusuario 
        JOIN caminata AS t1 ON t2.fkcaminata = t1.idcaminata 
        WHERE t3.idusuario = $1 
        ORDER BY t2.fecha ASC`,
        [idpersona]
      );
      console.log(caminataUser);

      return caminataUser.rows; //<--- devuelve un array de objetos (Usuarios) :D
      //   console.log(allCaminataTest);
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
    return res.status(200).json({
      mensaje: "Error al obtener todos los Tests de Caminata del usuario",
      rp: "no",
    });
  }
};

export const crearTestBruceModModel = async (data) => {
  const { etapas, saturacionvodos } = data;

  // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
  // console.log("Modelo", data);
  // console.log(typeof etapa);
  // numeroetapa
  const dt1 = selecionarEtapa(etapas);

  const { velocidad, grados, tiempo, vodos, etapa } = dt1;
  // console.log(dt1);
  const query =
    "INSERT INTO etapas (elefinal, velocidadfinal, numeroetapa, vodos, saturacionvodos, tiempo) VALUES ($1, $2, $3, $4, $5, $6)RETURNING idetapa";

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

export const crearHistorialUserModel = async (data, idusuario) => {
  console.log(data);
  const resultados = calculoImc(data);
  console.log(resultados);
  const { imc, imcdescripcion, peso } = resultados;

  // Preparar la consulta SQL para insertar en la tabla historial
  const query =
    "INSERT INTO historial (peso, imc, imcdescripcion,idusuario) VALUES ($1, $2, $3, $4)";
  const values = [peso, imc, imcdescripcion, idusuario];

  try {
    // Ejecutar la consulta y enviar los datos a la tabla historial
    const res = await pool.query(query, values);
    console.log("Res en modelo", res);
    return { mensaje: "Se registro exitosamente", rp: "si" };
  } catch (error) {
    console.error("Error al insertar datos en historial:", error);
    throw error; // Propagar el error para que sea manejado por quien llame a esta función
  }
};

export const mesRealizoModel = async (idusuario) => {
  const query = `WITH meses AS (
    SELECT generate_series(
        (SELECT DATE_TRUNC('month', MIN(fecha)) FROM tests WHERE idusuario = $1),
        (SELECT DATE_TRUNC('month', MAX(fecha)) FROM tests WHERE idusuario = $1),
        INTERVAL '1 month'
    ) AS mes
)
SELECT
    to_char(m.mes, 'YYYY-MM') AS mes,
    CASE 
        WHEN SUM(CASE WHEN t.fkbruce IS NOT NULL THEN 1 ELSE 0 END) > 0 THEN 1 
        ELSE 0 
    END AS testbrucerealizado,
    CASE 
        WHEN SUM(CASE WHEN t.fkcaminata IS NOT NULL THEN 1 ELSE 0 END) > 0 THEN 1 
        ELSE 0 
    END AS testcaminatarealizado
FROM
    meses m
LEFT JOIN
    tests t ON DATE_TRUNC('month', t.fecha) = m.mes AND t.idusuario = $1
GROUP BY
    m.mes
ORDER BY
    m.mes;
`;
  const client = await pool.connect(); // Conexión a la base de datos

  try {
    const res = await client.query(query, [idusuario]);
    // console.log("Res en modelo", res);
    return res.rows;
  } catch (error) {
    console.error("Error al sacar datos en las fechas:", error);
    throw error; // Propagar el error para que sea manejado por quien llame a esta función
  } finally {
    client.release(); // Liberar cliente de la base de datos
  }
};

export const notasDiariasModel = async (id) => {
  const query = `
    SELECT descripcion FROM notasdiarias WHERE idnota = $1
   `;

  const client = await pool.connect();

  try {
    const res = await client.query(query, [id]);
    if (res.rowCount === 0) {
      return { rp: "no", mensaje: "No hay nada diaria con ese id" };
    } else {
      return res.rows[0];
    }
  } catch (e) {
    throw e;
  }
};

export const registroRecomendacionModel = async (idtests, descripcion) => {
  const query =
    "INSERT INTO recomendaciones (descripcion,idtests) VALUES ($1, $2)";
  const values = [descripcion, idtests];

  try {
    // Ejecutar la consulta y enviar los datos a la tabla historial
    const res = await pool.query(query, values);
    return { mensaje: "Se registro exitosamente", rp: "si" };
  } catch (error) {
    console.error("Error al insertar datos en historial:", error);
    throw error; // Propagar el error para que sea manejado por quien llame a esta función
  }
};

export const BruceOnePersonModel = async (idpersona) => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const bruceUser = await client.query(
        `SELECT t3.idusuario, t2.fecha,  t1.elefinal,	t1.velocidadfinal,	t1.numeroetapa,	t1.vodos,	t1.saturacionvodos,	t1.tiempo
        FROM tests AS t2 
        JOIN usuario AS t3 ON t2.idusuario = t3.idusuario 
        JOIN etapas AS t1 ON t2.fkbruce = t1.idetapa 
        WHERE t3.idusuario =  $1
        ORDER BY t2.fecha ASC `,
        [idpersona]
      );
      console.log(bruceUser);

      return bruceUser.rows; //<--- devuelve un array de objetos (test de bruces ) :D
      //   console.log(allCaminataTest);
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
    return res.status(200).json({
      mensaje: "Error al obtener todos los Tests de Caminata del usuario",
      rp: "no",
    });
  }
};

export const allRecomendacionesModel = async () => {
  try {
    const result = await pool.query("SELECT * FROM recomendaciones");
    return result.rows;
  } catch (error) {
    return {
      rp: "no",
      error,
      mensaje: "No se pudo traer las recomendaciones",
    };
  }
};

export const recomendacionesOneUserModel = async (idtests) => {
  try {
    const result = await pool.query(
      "SELECT * FROM recomendaciones WHERE idtests = $1",
      [idtests]
    );
    return result.rows[0];
  } catch (error) {
    return {
      rp: "no",
      error,
      mensaje: "No se pudo traer las recomendaciones",
    };
  }
};
