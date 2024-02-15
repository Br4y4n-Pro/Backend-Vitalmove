import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";

import { addUserNew, loginUser, searchUser, allUser, searchUsers, deleteUser, updateUser } from '../controllers/controllerdata.js';
import { upload } from '../models/multerconfig.js';

const router = express.Router();


const miRegion = 'us-east-1';
const s3 = new S3Client({
  region: miRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
},});

router.post("/subida", (req, res) => {
  const bucket = "vitalmoveimagenes";

  // Multer
  const storage = multer.memoryStorage(); // multer almacena el archivo de forma temporal.
  const upload = multer({ storage: storage }).single('file');

  //FUNCIÓN DE SUBIDA S3
  upload(req, res, async (err) => {
    if (err) {
      console.log("error desde upload: ", err);
      return res.status(400).json({ mensaje: "Error en la subida del archivo." });
    }
    const carpetaInternaBucket = req.file.originalname;
    const urlImagen = `https://${bucket}.s3.${miRegion}.amazonaws.com/${carpetaInternaBucket}`;
    
    try {
        console.log(req.file)
      // Redimensionamos la imagen antes de subirla a S3
      const redimensionBuffer = await sharp(req.file.buffer)
        .resize({ width: 600, height: 600, fit: 'cover' })
        .toBuffer();

      const params = {
        Bucket: bucket,
        Key: carpetaInternaBucket,
        Body: redimensionBuffer,
        ContentType: 'image/jpeg',
      }
      // SUBIR LA IMAGEN
      await s3.send(new PutObjectCommand(params));
      return res.status(200).json({ urlImagen: urlImagen, mensaje: "Archivo subido correctamente" });
    } catch (error) {
      console.log("Error al subir la imagen a S3: ", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  });
});

//upload debería cargar la imagen y guardarla en la carpeta src/public
//el archivo de multer está en la carpeta models
//router.post('/addUserWithImagen',upload,muestra)  Ruta de prueba para ver que llegaban los datos xD

//User Routes
router.post('/addUser', upload, addUserNew);
router.get('/loginUser', loginUser, searchUser);
router.get('/allUser', allUser)
router.get('/buscadorUser', searchUsers)
router.delete('/deleteUser', deleteUser)
router.put('/updateUser', updateUser)

export default router
