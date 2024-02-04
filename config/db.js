let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;


export const CONFIG_DB = {
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
      require: true,
    }
};

