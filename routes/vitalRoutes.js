import express from 'express';
const router = express.Router();
import { addUserNew, principal,muestra } from '../controllers/controllerdata.js';
import { upload } from '../models/multerconfig.js';

router.post('/addUser',addUserNew);
//upload deberia cargar la imagen y guardarla en la carpeta src/public
// el archivo de multer esta en carpeta models
router.post('/addUserWithImagen',upload,muestra)
router.get('/', principal);

export default router