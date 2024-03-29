import express from "express";

import {
  addUserNew,
  loginUser,
  allUser,
  searchUsers,
  deleteUser,
  updateUser,
  prueba,
  getUserInfo,
  loginHistorial,
} from "../controllers/controllerdata.js";
import { uploadDisk, uploadBuffer } from "../models/multerconfig.js";
import {
  BruceOnePerson,
  allRecomendaciones,
  caminataOnePerson,
  getAllBruceTests,
  getAllCaminataTests,
  mesRealizo,
  notasDiarias,
  recomendacionesOneUser,
} from "../controllers/controlersTestsB.js";
import {
  crearCaminata,
  crearTestBruce,
} from "../controllers/controllerTestC.js";
import { crearHistorialUserModel } from "../models/testVItalMoveModel.js";
const router = express.Router();

//upload debería cargar la imagen y guardarla en la carpeta src/public
//el archivo de multer está en la carpeta models
//router.post('/addUserWithImagen',upload,muestra)  Ruta de prueba para ver que llegaban los datos xD

//User Routes
router.post("/subida", uploadBuffer, prueba);

router.post("/addUser", uploadBuffer, addUserNew);
// HistorialNewUser;
router.post("/login", loginUser); // Ruta para el inicio de sesión
router.get("/loginHistorial/:id", loginHistorial);
router.get("/user", getUserInfo); // Ruta para obtener información del usuariorouter.get('/allUser', allUser)
router.get("/buscadorUser", searchUsers);
router.delete("/deleteUser", deleteUser);
router.put("/updateUser", updateUser);
router.get("/allUser", allUser);

//Tests

router.get("/mesesCaminata/:id", mesRealizo);
router.get("/notasdiarias/:id", notasDiarias);

router.get("/allCaminata", getAllCaminataTests);
router.get("/allCaminata/:id", caminataOnePerson);
router.post("/crearCaminata", crearCaminata);

router.get("/allBruce", getAllBruceTests);
router.get("/allBruce/:id", BruceOnePerson);
router.post("/crearTestBruce", crearTestBruce);

router.get("/allRecomendaciones", allRecomendaciones);
router.get('/allRecomendaciones/:id',recomendacionesOneUser)

export default router;
