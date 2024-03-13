import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
import { CONFIG_DB } from "../config/db.js";
import bcrypt from "bcrypt";

const pool = new Pool(CONFIG_DB);

// Prueba de conexion a la base de datos
export const getPgVersion = async () => {
  const client = await pool.connect();          //aqui 
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
      imgperfil,
      nombres
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
    ) RETURNING idusuario`;

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
    return {
      mensaje:
        "No se puede guardar: valor nulo, indefinido o cadena vacía no permitidoEl DNI ingresado no existe",
      rp: "no",
    };
  }
  console.log("llego")

  if ( await validateDniExist(dni)) {
    return{
      mensaje: `El número de dni ${dni} ya está registrado`,
      rp: "no",
    };    
  }
  console.log("siguio");
  // uso de bcrypt para cifrar la contraseña
  console.log("hash");
  const hash_contrasena = await bcrypt.hash(contrasena, 10);
  console.log("siguio");
  console.log("roll");
  const roll = (value) => {
    if (value == undefined) {
      return 0;
    }
    return parseInt(value);
  };
  console.log("sigui0", roll);
  console.log("nivel Actividad");
  const nivelSemanaFuncion = (value) => {
    const numero = parseInt(value);

    if (numero >= 3 && numero <= 7) {
      return "Moderado";
    } else if (numero == 0) {
      return "Sedentario";
    }
    return "bajo";
  };
  const nivelsemanaResult = nivelSemanaFuncion(actividadsemana);
  const rolResult = roll(rol);
  console.log(nivelsemanaResult, "  ", rolResult);
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
    nivelsemanaResult,
    nombreemergencia,
    parentesco,
    rh,
    rolResult,
    talla,
    telefonoemergencia,
    genero,
    linkImagen,
    nombres,
  ];

  console.log("valores de la query", valuesQuery);
  console.log(linkImagen);
  const client = await pool.connect(); // Conexión a la base de datos
  console.log("conecto");
  try {
    console.log("Ejecutando consulta SQL:", sqlQuery);
    console.log("Valores de la consulta:", valuesQuery);

    const result = await client.query(sqlQuery, valuesQuery);
    console.log("Resultado de la consulta:", result);
    console.log(result.rowCount, result.rows);
    // Usuario Creado
    if (result.rowCount === 1) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta SQL:", error);

    return {
      mensaje: "Error al registrar el usuario",
      rp: "no",
    };
  } finally {
    client.release(); // Liberar cliente de la base de datos
  }
};

export const loginUserModel = async (data) => {
  try {
    const { dni, contrasena } = data;
    console.log(dni);
    const client = await pool.connect(); // Conexión a la base de datos

    if ((await validateDniExist(dni)) == null) {
      return {
        mensaje: "El DNI ingresado no está registrado en nuestros servicios",
        rp: "no",
      };
    }

    try {
      const result = await client.query(
        "SELECT * FROM usuario WHERE dni = $1",
        [dni]
      );
      console.log(result);
      const datos = result.rows[0];
      console.log("DAtos de bd :,", datos);

      const compareContrasena = await bcrypt.compare(
        contrasena,
        datos.contrasena
      );

      console.log(compareContrasena);

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
  } catch (error) {
    return {
      mensaje: "Error al iniciar sesion",
      rp: "no",
    };
  }
};


export const loginHistorialModel = async (idUsuario) => {
    try {
      const client = await pool.connect(); // Conexión a la base de datos
      console.log(idUsuario, ' modelo antes de')
      const result = await client.query(
        'SELECT * FROM historial WHERE idusuario = $1 ORDER BY fecha DESC',[idUsuario]
        );
        console.log(result.rows)
        return result.rows
    } catch (error) {
      return {
      mensaje: "Error al sacar el historial",
      rp: "no",
      error:error

    }
   }
  };


export const getAllUsersModel = async () => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos

    try {
      const allUserDB = await client.query("SELECT * FROM usuario");

      return allUserDB.rows;
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
    return {
      mensaje: "Error al obtener todos los usuarios",
      rp: "no",
    };
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
    return {
      mensaje: "Error al consultar el usuario ",
      rp: "no",
    };
  }
};
export const deleteUserModel = async (dni) => {
  if (validateDniExist(dni)) {
    const result = await pool.query("SELECT dni FROM usuario where dni = $1", [
      dni,
    ]);
    if (result.rows.length === 1) {
      return {
        mensaje: "Se elimino el usuario exitosamente",
        rp: "si",
      };
    } else {
      return {
        mensaje: "El DNI ingresado no existe",
        rp: "no",
      };
    }
  }
  return {
    mensaje: "El DNI ingresado no existe",
    rp: "no",
  };
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
  console.log('entro')
  const result = await pool.query("SELECT dni FROM usuario where dni = $1", [
    dniToRegister,
  ]);
  console.log("Dni Existe", result);
  try {
    const result = await pool.query("SELECT dni FROM usuario where dni = $1", [
    dniToRegister,
    ]);
    console.log(result.rowCount)
    if (result.rows.length === 1) {
      console.log(true)
      return true;
    } else {
      console.log(null)
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
