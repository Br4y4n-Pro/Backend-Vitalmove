import dotenv from 'dotenv';
dotenv.config();

//Usar Bcrypt aca

import pkg from 'pg';
const { Pool } = pkg;
import { CONFIG_DB } from '../config/db.js'


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
    
 console.log(data)

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
  );
`;

const valuesQuery = [ 
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
];

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
