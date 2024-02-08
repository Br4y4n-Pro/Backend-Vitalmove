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
export const addUSerModel = async ( data,file ) =>{

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
    
    const {filename} = file
    
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


const requiredValues =[
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

if ( await validateDniExist(dni)) {
  throw new Error("El numero de DNI ya esta registrado")
}

 // uso de bcrypt para cifrar la contraseña    
 const hash_contrasena = await bcrypt.hash(contrasena,10);
 console.log('-----------------------------------------------------------')
 console.log(hash_contrasena)
  console.log(filename)
 const link_imagen = filename;

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
      link_imagen,
      nombres
    ];

    console.log(valuesQuery);

  const result = await pool.query( sqlQuery , valuesQuery );
  
   try {
    //Usuario Creado
    if(result.rowCount === 1){
      return result.rowCount;
    }else{
      return null
    }
   } catch (error) {
      console.error("Error al registrar el usuario", error);
      throw error;
   }
  };
export const loginUSerModel = async ( data ) => {
try {
  const {dni,contrasena} = data
  
  
  if (await validateDniExist(dni)) {
  const result = await pool.query("SELECT dni,contrasena FROM usuario WHERE dni = $1",[dni])
    const datos = result.rows[0]
    const compareContrasena = await bcrypt.compare(contrasena,datos.contrasena)
    if(!compareContrasena){
      throw new Error("La contraseña proporcionada no coinciden")
    }
    return true 
}else{
  throw new Error("El dni que se ingreso no esta registrado en nuestro servicios")
}

} catch (error) {
  console.error("Error al registrar el usuario", error);
      throw error;
}
};






export const searchUserModel = async ( dni ) =>{
        
  try {
    const query = "SELECT actividad_semana,alergias,apellidos,dni,dependencia,direccion,eps,fecha_nacimiento,grupo,nivel_semana,nombre_emergencia,parentesco,rh,rol,talla,telefono_emergencia,genero,nombres FROM usuario WHERE dni = $1";
    const value = [dni];

    const result = await pool.query( query,value);
    console.log(result.rows[0])
    return result.rows[0]
    } catch (error) {
      console.error("Error al consultar el usuario", error);
      throw error;
    }
  };


//------------------------------------------------
//-----------------VALIDATES----------------------
//------------------------------------------------

const validateDniExist = async ( dniToRegister ) =>{
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