import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

// AWS S3 ///////////////////////////////////////////////////
// CONFIGURAR S3

const bucket = "vitalmoveimagenes";
const miRegion = "us-east-1";
const s3 = new S3Client({
  region: miRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// RENOMBRAR LA IMAGEN A SUBIR
export const uploadImagenS3Model = async (file) => {
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

  await s3.send(new PutObjectCommand(params));
  const urlImagen = `https://${bucket}.s3.${miRegion}.amazonaws.com/${nameImage}`;
  return urlImagen;
};
