import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

// AWS S3 ///////////////////////////////////////////////////
// CONFIGURAR S3
   console.log(process.env.AWS_ACCESS_KEY_ID)
  console.log(process.env.AWS_SECRET_ACCESS_KEY)


// RENOMBRAR LA IMAGEN A SUBIR
export const uploadImagenS3Model = async (file) => {
  const bucket = 'vitalmoveimages';
  const miRegion = 'us-east-1';
  const s3 = new S3Client({
    region: miRegion,
    credentials: {
      accessKeyId:process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  },
});
  console.log(file)
  if (!file) {
    console.log('Vaciado')
    return '';
  } else {
    console.log('Entrro')
    file.customName = uuidv4() + path.extname(file.originalname).toLowerCase();
    const nameImage = file.customName;
    const redimensionBuffer = await sharp(file.buffer)
      .resize({ width: 600, height: 600, fit: "cover" })
      .toBuffer();

    const params = {
      Bucket: bucket,
      Key: nameImage,
      Body: redimensionBuffer,
      ContentType: "image/jpeg",
    };

    try {
      await s3.send(new PutObjectCommand(params));
      console.log('se envio?')
      const urlImagen = `https://${bucket}.s3.${miRegion}.amazonaws.com/${nameImage}`;
      return urlImagen;
    } catch (error) {
      console.log('Error al enviar imagen a S3:', error);
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      console.log({ requestId, cfId, extendedRequestId });
      // Aquí puedes decidir cómo manejar el error, por ejemplo, lanzando el error o devolviendo null.
      throw error; // O manejar de otra manera
    }
  }
};
