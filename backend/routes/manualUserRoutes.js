import express from 'express';
import { userSignup, userLogin, userLogout } from '../controllers/manualUserController.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', userLogout); 

export default router;
