import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
import { CONFIG_DB } from "../config/db.js";
import bcrypt from "bcrypt";

const pool = new Pool(CONFIG_DB);

// Prueba de conexion a la base de datos
export const getPgVersion = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
};

export const addUserModel = async (data, linkImagen) => {
  const {
    actividadsemana,
    alergias,
    apellidos,
    contrasena,
    dni,
    dependencia,
    direccion,
    eps,
    fechanacimiento,
    grupo,
    nivelsemana,
    nombreemergencia,
    parentesco,
    rh,
    rol,
    talla,
    telefonoemergencia,
    genero,
    nombres,
  } = data;

  const sqlQuery = `
    INSERT INTO usuario (
      actividadsemana,
      alergias,
      apellidos,
      contrasena,
      dni,
      dependencia,
      direccion,
      eps,
      fechanacimiento,
      grupo,
      nivelsemana,
      nombreemergencia,
      parentesco,
      rh,
      rol,
      talla,
      telefonoemergencia,
      genero,
      img_perfil,
      nombres
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
    );`;


  const requiredValues = [
    actividadsemana,
    alergias,
    apellidos,
    contrasena,
    dni,
    dependencia,
    direccion,
    eps,
    fechanacimiento,
    nombreemergencia,
    parentesco,
    rh,
    talla,
    telefonoemergencia,
    genero,
    nombres,
  ];

  console.log("Valores requeridos ", requiredValues);

  if (requiredValues.some((value) => value == null || value === "")) {
    return res.status(200).json({
      mensaje:
        "No se puede guardar: valor nulo, indefinido o cadena vacía no permitidoEl DNI ingresado no existe",
      rp: "no",
    });
  }

  if (await validateDniExist(dni)) {
    return res.status(200).json({
      mensaje: "El número de DNI ya está registrado",
      rp: "no",
    });
  }

  // uso de bcrypt para cifrar la contraseña
  const hash_contrasena = await bcrypt.hash(contrasena, 10);

  const valuesQuery = [
    actividadsemana,
    alergias,
    apellidos,
    hash_contrasena,
    dni,
    dependencia,
    direccion,
    eps,
    fechanacimiento,
    grupo,
    nivelsemana,
    nombre_emergencia,
    parentesco,
    rh,
    rol,
    talla,
    telefonoemergencia,
    genero,
    linkImagen,
    nombres,
  ];

  console.log("valores de la query", valuesQuery);

  const client = await pool.connect(); // Conexión a la base de datos

  try {
    const result = await client.query(sqlQuery, valuesQuery);
    // return res.status(200).json({
    //   mensaje: "Uno o ambos campos estan vacios",
    //   rp: "no",
    // });
    // Usuario Creado
    if (result.rowCount === 1) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    return res.status(200).json({
      mensaje: "Error al registrar el usuario",
      rp: "no",
    });
  } finally {
    client.release(); // Liberar cliente de la base de datos
  }
};

export const loginUserModel = async (data) => {
  if (data == undefined) {
    return res.status(200).json({
      mensaje: "No se recibio informarcion o esta incompleta",
      rp: "no",
    });
  }
  try {
    const { dni, contrasena } = data;
    // console.log(dni);
    const client = await pool.connect(); // Conexión a la base de datos

    if (validateDniExist(dni)) {
      try {
        const result = await client.query(
          "SELECT * FROM usuario WHERE dni = $1",
          [dni]
        );
        const datos = result.rows[0];
        // console.log(datos);
        const compareContrasena = await bcrypt.compare(
          contrasena,
          datos.contrasena
        );

        if (!compareContrasena) {
          return {
            mensaje: "La contraseña proporcionada no coincide",
            rp: "no",
          };
        }

        return { ...datos, rp: "si" };
      } finally {
        client.release(); // Liberar cliente de la base de datos
      }
    } else {
<<<<<<< HEAD
      return {
        mensaje: "El DNI ingresado no está registrado en nuestros servicios",
        rp: "no",
      };
=======
      return res.status(200).json({
        mensaje: "El DNI ingresado no está registrado en nuestros servicios",
        rp: "no",
      });
>>>>>>> 1206c439259d0eb138ce168540ebf3c72b0e89cc
    }
  } catch (error) {
    return res.status(200).json({
      mensaje: "Error al iniciar sesion",
      rp: "no",
    });
  }
};
export const getAllUsersModel = async () => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const allUserDB = await client.query("SELECT * FROM usuario");
      const dataAllUser = {
        cantidad: allUserDB.rowCount,
        datos: allUserDB.rows,
      }; //<--- devuelve un array de objetos (Usuarios) :D
      console.log(dataAllUser);

      return dataAllUser;
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
<<<<<<< HEAD
    console.error("Error al obtener todos los usuarios", error);
    throw new Error("Error al obtener todos los usuarios", error);
=======
    return res.status(200).json({
      mensaje: "Error al obtener todos los usuaarios",
      rp: "no",
    });
>>>>>>> 1206c439259d0eb138ce168540ebf3c72b0e89cc
  }
};
export const getUserInfoModel = async (values) => {
  const regexSpace = /^\s*$/; //<--- Regex de que el texto solo tiene espacios
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      if (regexSpace.test(values) || values === "") {
        return new Error("El valor enviado esta vacio o solo tiene espacios");
      }

      if (!isNaN(values)) {
        const query = "SELECT * FROM usuario WHERE  dni::text LIKE $1 || '%'";
        const value = [values];
        const result = await client.query(query, value);
        return result.rows;
      } else {
        const query =
          "SELECT * FROM usuario WHERE nombres ILIKE '%' || $1 || '%' OR apellidos ILIKE '%' || $1 || '%'";
        const value = [values];
        const result = await client.query(query, value);
        return result.rows;
      }
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
<<<<<<< HEAD
    console.error("Error al consultar el usuario", error);
    throw Error(("Error al consultar el usuario", error));
=======
    return res.status(200).json({
      mensaje: "Error al consultar el usuario ",
      rp: "no",
    });
>>>>>>> 1206c439259d0eb138ce168540ebf3c72b0e89cc
  }
};
export const deleteUserModel = async (dni) => {
  if (validateDniExist(dni)) {
    const result = await pool.query("SELECT dni FROM usuario where dni = $1", [
      dni,
    ]);
    if (result.rows.length === 1) {
      return res.status(302).json({
        mensaje: "Se elimino el usuario exitosamente",
        rp: "si",
      });
    } else {
      return res.status(200).json({
        mensaje: "El DNI ingresado no existe",
        rp: "no",
      });
    }
  }
  return res.status(200).json({
    mensaje: "El DNI ingresado no existe",
    rp: "no",
  });
};
export const updateUserModel = async (datos) => {
  // console.log(datos)
  const keys = Object.keys(datos);
  // console.log(keys)

  let keyPop = keys.filter((elemento) => elemento !== "id_usuario");

  console.log(keyPop);
  const values = Object.values(datos);
  console.log(values);

  const parametros = keyPop
    .map((key) => ` ${key} = $${keys.indexOf(key) + 1}`)
    .join(",");
  /*ARRIBA lo que hace esto es crear una cadena con los datos de key un ejemplo de como se veria seria asi "dni = $1" y eso lo repite con cada uno de las keys*/

  console.log(parametros);
  const ultimoValor = Object.values(datos).length;

  console.log(ultimoValor);

  const query = `UPDATE usuario SET ${parametros} WHERE id_usuario = $${ultimoValor}`;
  console.log(query);
  const result = await pool.query(query, values);
  console.log(result);

  if (result.rowCount === 1) {
    return result;
  } else {
    return null;
  }

  /* por donde quede :)
    estoy viendo como hago para eliminar las comillas que tiene el objecto, elemento o array ni se que mierda es xD al final del mismo para meter el dni 
    estoy pensando en la solucion de que en el body meter al final de todo el dni asi no tengo que hacer todas estas vueltas xD
    pero muy easy quiero otra solución xD
  */
  // no se hizo validacion de dni ya que no se usa y si se pasa el id es por que el usuario fue seleccionado
  /* Arreglado xD la solucion fue hacerlo asi pero luego de analizar y pensar que el dni tambien se puede cambiar decidi que 
 lo mejor era usar el id_usuario este id se le pasara al objecto se añadira detras de escena ya que el cliente no tiene acceso a
 este id si no lo tiene pues se consigue con alguna query de mas que se haga antes de la consulta para seleccionarlo pero creo que no es necesario
 ya que este id se puede pasar ya que hay un get de todos los user y al hacer click esa info se carga :) 
 update hecho posible modificaciones dependiendo de como vaya el frontend se despide brayan 1:10am :/ 
 */
};

//------------------------------------------------
//-----------------VALIDATES----------------------
//------------------------------------------------

export const validateDniExist = async (dniToRegister) => {
  const result = await pool.query("SELECT dni FROM usuario where dni = $1", [
    dniToRegister,
  ]);
  try {
    if (result.rows.length === 1) {
      return true;
    } else {
      return null; //no se encontro el dni
    }
  } catch (error) {
    console.error("Error al obtener dni del usuario", error);
    throw error;
  }
};
//------------------------------------------------
//-----------------END VALIDATES------------------
//------------------------------------------------
