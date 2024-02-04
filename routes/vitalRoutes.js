import express from 'express';
const router = express.Router();
import { addUserNew, principal } from '../controllers/controllerdata.js';


router.post('/addUser',addUserNew);
router.get('/', principal);
export default router