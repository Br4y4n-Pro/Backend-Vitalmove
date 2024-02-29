// Configuraciòn de Multer para guardar archivos en una carpeta
import { fileURLToPath } from "url";
import multer, { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const publicPath = path.join(__dirname, "../src/public");

//Lugar de almacenamiento de la imagen y nombre de la imagen

const storage = diskStorage({
  destination: path.join(publicPath),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
  },
});

export const uploadDisk = multer({
  storage, //<--- se usa el storage aqui
  dest: path.join(publicPath), //<-- carpeta donde se va a guardar
  fileFilter: (req, file, cb) => {
    //<-- filtro de las imagenes se usa una funcion
    const filetypes = /jpeg|jpg|png|gif|webp/; //<-- los tipos de archivo que se permiten
    const mimetype = filetypes.test(file.mimetype); //<-- valor que tiene el archivo subido aparte de otros
    const extname = filetypes.test(path.extname(file.originalname)); //<-- no me acuerdo que era ver de nuevo el video xD
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Archivo no soportado", error);
  },
}).single("img_perfil");

// Multer para MemoryStorage
const storageBuffer = multer.memoryStorage(); // multer almacena el archivo de forma temporal.
export const uploadBuffer = multer({ storage: storageBuffer }).single(
  "imgperfil"
);
