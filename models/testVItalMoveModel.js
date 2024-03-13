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
  if (etapa == "Etapa 1") {
    return { velocidad: 2.7, grados: 0, tiempo: 3, vodos: 2.3, etapa: 1 };
  }
  if (etapa == "Etapa 2") {
    return { velocidad: 2.7, grados: 5, tiempo: 3, vodos: 3.5, etapa: 2 };
  }
  if (etapa == "Etapa 3") {
    return { velocidad: 2.7, grados: 10, tiempo: 3, vodos: 4.6, etapa: 3 };
  }
  if (etapa == "Etapa 4") {
    return { velocidad: 4, grados: 12, tiempo: 3, vodos: 7, etapa: 4 };
  }
  if (etapa == "Etapa 5") {
    return { velocidad: 5.4, grados: 14, tiempo: 3, vodos: 10.1, etapa: 5 };
  }
  if (etapa == "Etapa 6") {
    return { velocidad: 6.7, grados: 16, tiempo: 3, vodos: 12.9, etapa: 6 };
  }
  if (etapa == "Etapa 7") {
    return { velocidad: 8.0, grados: 18, tiempo: 3, vodos: 15, etapa: 7 };
  }
  if (etapa == "Etapa 8") {
    return { velocidad: 8.8, grados: 20, tiempo: 3, vodos: 16, etapa: 8 };
  }
  if (etapa == "Etapa 9") {
    return { velocidad: 10.5, grados: 22, tiempo: 3, vodos: 19.1, etapa: 9 };
  }
};

// export const crearHistorialUserModel = async (data) => {

//   const { fcr, tiempo, distancia, fcm } = data;
//   let barevodos = "";

//   // Ejemplo básico de inserción (recuerda manejar errores adecuadamente)
//   console.log("Modelo", data);

//   const Consumov = (0.1 * (distancia / tiempo) + 3.5).toFixed(2);
//   // console.log(Consumov);
//   if (Consumov <= 10.99) {
//     // console.log("aqui");
//     barevodos = "Bajo";
//   } else if (Consumov >= 16.01) {
//     // console.log("aca");
//     barevodos = "excelente";
//   } else {
//     // console.log("DONDE ");|
//     barevodos = "Bueno";
//   }
//   console.log(barevodos);
//   const query =
//     "INSERT INTO caminata (fcr, tiempo, distancia, fcm, consumovo2,barevodos) VALUES ($1, $2, $3, $4,$5,$6)";
//   const values = [fcr, tiempo, distancia, fcm, Consumov, barevodos];
//   console.log(fcr, tiempo, distancia, fcm, Consumov, barevodos);
//   const res = await pool.query(query, values);
//   console.log("res  em modelo", res);
//   return res;
// };

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

const calculoImc = (data) => {
  const { peso, talla } = data;

  const calculoImc = peso / (talla * talla);
  if (calculoImc < 0) {
    return { mensaje: "Error al calcular el imc", rp: "no" };
  }
  // Determinar la descripción de IMC según el valor de IMC
  if (calculoImc < 18.5) {
    return { imcdescripcion: "Bajo peso", imc: calculoImc, peso: peso };
  }
  if (calculoImc >= 18.5 && calculoImc <= 24.9) {
    return { imcdescripcion: "Normal", imc: calculoImc, peso: peso };
  }
  if (calculoImc >= 25.0 && calculoImc <= 29.9) {
    return { imcdescripcion: "Sobrepeso", imc: calculoImc, peso: peso };
  }
  if (calculoImc >= 30.0 && calculoImc <= 34.9) {
    return { imcdescripcion: "Obesidad grado 1", imc: calculoImc, peso: peso };
  }
  if (calculoImc >= 35.0 && calculoImc <= 39.9) {
    return { imcdescripcion: "Obesidad grado 2", imc: calculoImc, peso: peso };
  } else {
    return { imcdescripcion: "Obesidad grado 3", imc: calculoImc, peso: peso };
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
