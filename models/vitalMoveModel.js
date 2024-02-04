import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;
import { CONFIG_DB } from '../config/db.js'


const pool = new Pool(CONFIG_DB);

export async function getPgVersion() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT version()');
      console.log(result.rows[0]);
    } finally {
      client.release();
    }
  };
  

