let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;


const CONFIG_DB = {
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
      require: true,
    }
}

module.exports = {
    CONFIG_DB,
}