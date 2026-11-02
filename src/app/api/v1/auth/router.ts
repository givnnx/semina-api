import express from 'express';
const router = express.Router();
import { signinCms, signupCms } from './controller';
import {
  authenticateUser,
  authorizeRoles,
} from '../../../middlewares/auth';

router.post('/signin', signinCms);
router.post('/signup', authenticateUser, authorizeRoles('owner'), signupCms);

export default router;
