import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;
import { CONFIG_DB } from '../config/db.js'
import bcrypt from "bcrypt";

const pool = new Pool(CONFIG_DB);

// Prueba de conexion a la base de datos
export const  getPgVersion = async ( ) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT version()');
      console.log(result.rows[0]);
    } finally {
      client.release();
    }
  };

export const addUserModel = async (data, linkImagen) => {
  const {
    actividad_semana,
    alergias,
    apellidos,
    contrasena,
    dni,
    dependencia,
    direccion,
    eps,
    fecha_nacimiento,
    grupo,
    nivel_semana,
    nombre_emergencia,
    parentesco,
    rh,
    rol,
    talla,
    telefono_emergencia,
    genero,
    nombres
  } = data;


  const sqlQuery = `
    INSERT INTO usuario (
      actividad_semana,
      alergias,
      apellidos,
      contrasena,
      dni,
      dependencia,
      direccion,
      eps,
      fecha_nacimiento,
      grupo,
      nivel_semana,
      nombre_emergencia,
      parentesco,
      rh,
      rol,
      talla,
      telefono_emergencia,
      genero,
      img_perfil,
      nombres
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
    );`;

  const requiredValues = [
    actividad_semana,
    alergias,
    apellidos,
    contrasena,
    dni,
    dependencia,
    direccion,
    eps,
    fecha_nacimiento,
    nombre_emergencia,
    parentesco,
    rh,
    talla,
    telefono_emergencia,
    genero,
    nombres
  ];

  console.log(requiredValues);

  if (requiredValues.some(value => value == null || value === "")) {
    throw new Error("No se puede guardar: valor nulo, indefinido o cadena vacía no permitido");
  }

  if (await validateDniExist(dni)) {
    throw new Error("El número de DNI ya está registrado");
  }

  // uso de bcrypt para cifrar la contraseña    
  const hash_contrasena = await bcrypt.hash(contrasena, 10);

  const valuesQuery = [
    actividad_semana,
    alergias,
    apellidos,
    hash_contrasena,
    dni,
    dependencia,
    direccion,
    eps,
    fecha_nacimiento,
    grupo,
    nivel_semana,
    nombre_emergencia,
    parentesco,
    rh,
    rol,
    talla,
    telefono_emergencia,
    genero,
    linkImagen,
    nombres
  ];

  console.log(valuesQuery);

  const client = await pool.connect(); // Conexión a la base de datos

  try {
    const result = await client.query(sqlQuery, valuesQuery);

    // Usuario Creado
    if (result.rowCount === 1) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al registrar el usuario", error);
    throw error;
  } finally {
    client.release(); // Liberar cliente de la base de datos
  }
};
export const loginUserModel = async (data) => {
  try {
    const { dni, contrasena } = data;

    const client = await pool.connect(); // Conexión a la base de datos

    if (await validateDniExist(dni)) {
      try {
        const result = await client.query("SELECT dni, contrasena FROM usuario WHERE dni = $1", [dni]);
        const datos = result.rows[0];
        const compareContrasena = await bcrypt.compare(contrasena, datos.contrasena);

        if (!compareContrasena) {
          throw new Error("La contraseña proporcionada no coincide");
        }
        
        return true;
      } finally {
        client.release(); // Liberar cliente de la base de datos
      }
    } else {
      throw new Error("El DNI ingresado no está registrado en nuestros servicios");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};
export const getAllUsersModel = async () => {
  try {
    const client = await pool.connect(); // Conexión a la base de datos
    
    try {
      const allUserDB = await client.query("SELECT * FROM usuario");
      const dataAllUser = { cantidad: allUserDB.rowCount, datos: allUserDB.rows }; //<--- devuelve un array de objetos (Usuarios) :D
      console.log(dataAllUser);
      
      return dataAllUser;
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
    console.error("Error al obtener todos los usuarios", error);
    throw error;
  }
};
export const searchUserModel = async ( values ) => {
  const regexSpace = /^\s*$/; //<--- Regex de que el texto solo tiene espacios
  try {
    const client = await pool.connect(); // Conexión a la base de datos
    
    try {
      if (regexSpace.test(values) || values === "" ) {
        return new Error("El valor enviado esta vacio o solo tiene espacios")
      }
      
      if (!isNaN(values)) {
        const query = "SELECT actividad_semana, alergias, apellidos, dni, dependencia, direccion, eps, fecha_nacimiento, grupo, nivel_semana, nombre_emergencia, parentesco, rh, rol, talla, telefono_emergencia, genero, nombres FROM usuario WHERE  dni::text LIKE $1 || '%'";
        const value = [values];
        const result = await client.query(query, value);
        return result.rows;
      }else{
        const query = "SELECT actividad_semana, alergias, apellidos, dni, dependencia, direccion, eps, fecha_nacimiento,grupo, nivel_semana, nombre_emergencia, parentesco, rh, rol, talla, telefono_emergencia,genero, nombres FROM usuario WHERE nombres ILIKE '%' || $1 || '%' OR apellidos ILIKE '%' || $1 || '%'";
        const value = [values];
        const result = await client.query(query, value);
        return result.rows;
      }
    } finally {
      client.release(); // Liberar cliente de la base de datos
    }
  } catch (error) {
    console.error("Error al consultar el usuario", error);
    throw error;
  }
};
export const deleteUserModel = async( dni ) =>{
  if (validateDniExist(dni)) {
    const result = await pool.query( 'SELECT dni FROM usuario where dni = $1', [dni] )
    if (result.rows.length === 1) {
      return {message: "Se elimino el usuario exitosamente"}
    }else{
      return new Error("El dni ingresado no existe")
    }
  }
  return new Error("El dni ingresado no existe")
};
export const updateUserModel = async ( datos ) => {
  const keys = Object.keys(datos).slice(1); //<-- se hace un slice para eliminar el primer parametro que es el dni que no es necesario para actualizar sino solo para encontrar el usuario a editar 
  console.log(keys)
  const values = Object.values(datos).slice(1).join(",")
  console.log(values)
  const vamos = keys.map((key) =>` ${key} = $${keys.indexOf(key) + 1}`).join(",") 
  /*ARRIBA lo que hace esto es crear una cadena con los datos de key un ejemplo de como se veria seria asi "dni = $1" y eso lo repite con cada uno de las keys*/ 
  console.log(vamos)
  const cantidad = Object.keys(datos).length
  console.log(cantidad)
  const query = `UPDATE usuario SET ${vamos} WHERE dni = $${cantidad}`
  console.log(query)
  const datosdb = [values,datos.dni]
  console.log(datosdb)
  // const result = await pool.query(query,datosdb)
  // console.log(result)

  /* por donde quede :)
    estoy viendo como hago para eliminar las comillas que tiene el objecto, elemento o array ni se que mierda es xD al final del mismo para meter el dni 
    estoy pensando en la solucion de que en el body meter al final de todo el dni asi no tengo que hacer todas estas vueltas xD
    pero muy easy quiero otra solución xD
  */
};



//------------------------------------------------
//-----------------VALIDATES----------------------
//------------------------------------------------

export const validateDniExist = async ( dniToRegister ) =>{
  const result = await pool.query( 'SELECT dni FROM usuario where dni = $1', [dniToRegister] )   
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

}
//------------------------------------------------
//-----------------END VALIDATES------------------
//------------------------------------------------