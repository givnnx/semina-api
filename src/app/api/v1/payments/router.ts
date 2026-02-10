import express from 'express';
const router = express.Router();
import { create, index, find, update, destroy } from './controller';
import {
  authenticateUser,
  authorizeRoles,
} from '../../../middlewares/auth';

router.get('/', authenticateUser, authorizeRoles('organizer'), index);
router.get('/:id', authenticateUser, authorizeRoles('organizer'), find);
router.put('/:id', authenticateUser, authorizeRoles('organizer'), update);
router.delete('/:id', authenticateUser, authorizeRoles('organizer'), destroy);
router.post('/', authenticateUser, authorizeRoles('organizer'), create);

export default router;
