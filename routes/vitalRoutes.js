import express from 'express';


import { addUserNew, loginUser, searchUser, allUser, searchUsers, deleteUser, updateUser, prueba } from '../controllers/controllerdata.js';
import {uploadDisk , uploadBuffer} from '../models/multerconfig.js';
const router = express.Router();


//upload debería cargar la imagen y guardarla en la carpeta src/public
//el archivo de multer está en la carpeta models
//router.post('/addUserWithImagen',upload,muestra)  Ruta de prueba para ver que llegaban los datos xD

//User Routes
router.post('/subida', uploadBuffer, prueba)

router.post('/addUser', uploadBuffer, addUserNew);
router.get('/loginUser', loginUser, searchUser);
router.get('/allUser', allUser)
router.get('/buscadorUser', searchUsers)
router.delete('/deleteUser', deleteUser)
router.put('/updateUser', updateUser)

export default router
