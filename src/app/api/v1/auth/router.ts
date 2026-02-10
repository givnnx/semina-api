import express from 'express';
const router = express.Router();
import { signinCms, signupCms } from './controller';

router.post('/signin', signinCms);
router.post('/signup', signupCms);

export default router;
