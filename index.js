import  Express  from 'express';
const app = Express();

import cors from 'cors';
import bodyParser from 'body-parser';
import { getPgVersion } from './models/vitalMoveModel.js';
import  routers from './routes/vitalRoutes.js';
import { publicPath } from './models/multerconfig.js';

app.use('/public', Express.static((publicPath)));
app.use(cors());
app.use(bodyParser.json());
app.use('/',routers);

const puerto = process.env.PORT || 3050;
app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});

getPgVersion();

