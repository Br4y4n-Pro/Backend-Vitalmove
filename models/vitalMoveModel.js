const { Pool } = require('pg');
const { CONFIG_DB } = require('../config/db');
require('dotenv').config();


const pool = new Pool(CONFIG_DB);

async function getPgVersion() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT version()');
      console.log(result.rows[0]);
    } finally {
      client.release();
    }
  }
  

  module.exports ={
    getPgVersion
  }