import express from 'express';
const router = express.Router();
import { addUserNew, principal } from '../controllers/controllerdata.js';
import { upload } from '../models/multerconfig.js';

//upload deberia cargar la imagen y guardarla en la carpeta src/public
// el archivo de multer esta en carpeta models
// router.post('/addUserWithImagen',upload,muestra)  Ruta de prueba para ver que llegaban los datos xD
router.post('/addUser',upload,addUserNew);
router.get('/', principal);

export default router