import express from 'express';
const router = express.Router();
import { addUserNew , loginUser , searchUser , allUser , searchUsers, deleteUser, updateUser } from '../controllers/controllerdata.js';
import { upload } from '../models/multerconfig.js';

//upload deberia cargar la imagen y guardarla en la carpeta src/public
//el archivo de multer esta en carpeta models
//router.post('/addUserWithImagen',upload,muestra)  Ruta de prueba para ver que llegaban los datos xD

//User Routes
router.post('/addUser',upload,addUserNew);
router.get('/loginUser',loginUser,searchUser);
router.get('/allUser',allUser)
router.get('/buscadorUser',searchUsers)
router.delete('/deleteUser',deleteUser)
router.put('/updateUser',updateUser)
// router.get('/', principal);

export default router