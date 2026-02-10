import express from 'express';
const router = express.Router();
import { create } from './controller';
import upload from '../../../middlewares/multer';
import { authenticateUser } from '../../../middlewares/auth';

router.post('/', authenticateUser, upload.single('avatar'), create);
export default router;
