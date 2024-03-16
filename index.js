import  Express  from 'express';
const app = Express();

import cors from 'cors';
import bodyParser from 'body-parser';
import { getPgVersion } from './models/vitalMoveModel.js';
import  routers from './routes/vitalRoutes.js';
import { publicPath } from './models/multerconfig.js';
import yaml from "js-yaml";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

app.use('/public', Express.static((publicPath)));
app.use(cors());
app.use(bodyParser.json());

// Configuración de swagger
const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/',routers);
const puerto = process.env.PORT || 302;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});

getPgVersion();

