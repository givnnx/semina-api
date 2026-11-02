import express from 'express';
const router = express.Router();
import {
  createCMSOrganizer,
  createCMSUser,
  getCMSUsers,
} from './controller';

import {
  authenticateUser,
  authorizeRoles,
} from '../../../middlewares/auth';

router.post('/', authenticateUser, authorizeRoles('owner'), createCMSOrganizer);
router.post(
  '/users',
  authenticateUser,
  authorizeRoles('organizer'),
  createCMSUser
);
router.get(
  '/users',
  authenticateUser,
  authorizeRoles('owner', 'organizer'),
  getCMSUsers
);
export default router;
