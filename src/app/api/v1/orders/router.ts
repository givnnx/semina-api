import express from 'express';
const router = express.Router();
import { index } from './controller';
import {
  authenticateUser,
  authorizeRoles,
} from '../../../middlewares/auth';

router.get(
  '/',
  authenticateUser,
  authorizeRoles('organizer', 'admin', 'owner'),
  index
);

export default router;
