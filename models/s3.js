
// AWS S3 ///////////////////////////////////////////////////
// CONFIGURAR S3
const miRegion = 'us-east-1';
let s3 = new S3Client({
  region: miRegion,
  credentials: {
    accessKeyId: process.env.LLAVEACCESO,
    secretAccessKey: process.env.LLAVESECRETO,
  }
});

const params = {
    Bucket: vitalmoveimagenes,
    Body: redimensionBuffer,
    ContentType: 'image/jpeg',
  }

  // SUBIR LA IMAGEN
  const command = new PutObjectCommand(params);
  await s3.send(command)
  .then(response => {
    return res.status(200).json({urlImagen: urlImagen, mensaje: "archivo subido correctamente"});
  })
  .catch((error) =>{
    console.log("error al ejecutar send, ", error);
    return res.status(400).json({mensaje: "error al ejecutar comando, por favor intentar nuevamente"});
  });