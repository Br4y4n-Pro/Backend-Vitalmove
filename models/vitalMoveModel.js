import dotenv from 'dotenv';
dotenv.config();

//Usar Bcrypt aca

//<<------------- FALTA CREAR LAS VALIDACIONES DE LA CREACION DE USUARIO------------------->> ✅ HECHO

import pkg from 'pg';
const { Pool } = pkg;
import { CONFIG_DB } from '../config/db.js'
import bcrypt from "bcrypt";

const pool = new Pool(CONFIG_DB);

export const  getPgVersion = async ( ) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT version()');
      console.log(result.rows[0]);
    } finally {
      client.release();
    }
  };
  


  export const addUSerNewModel = async ( data ) =>{
    console.log('Modelo: Agregando usuario', data);
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
      img_perfil,
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
        
        
        const hash_contrasena = await bcrypt.hash(contrasena,10);
console.log('-----------------------------------------------------------')
          console.log(hash_contrasena)

          
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
      img_perfil,
      nombres
];


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
]


if (requiredValues.some(value => value == null || value === "")) {
  return new Error("No se puede guardar: valor nulo, indefinido o cadena vacía no permitido");
}

if ( await validateDniExist(dni)) {
    return new Error("El numero de DNI ya esta registrado")
}
// uso de bcrypt para cifrar la contraseña

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



  //------------------------------------------------
//-----------------VALIDATES----------------------
//------------------------------------------------

const validateDniExist = async ( dniToRegister ) =>{
  const result = await pool.query( 'SELECT dni FROM usuario where dni = $1', [dniToRegister] )   
  try {
    if (result.rows.length === 1) {
      return result.rows;
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