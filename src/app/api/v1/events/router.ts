import express from 'express';
const router = express.Router();
import { create, index, find, destroy, update } from './controller';
import {
  authenticateUser,
  authorizeRoles,
} from '../../../middlewares/auth';

router.get('/', authenticateUser, authorizeRoles('organizer', 'admin'), index);
router.get(
  '/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  find
);
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  update
);
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  destroy
);
router.post(
  '/',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  create
);

export default router;
