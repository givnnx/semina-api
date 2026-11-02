import express from 'express';
const router = express.Router();
import {
  getAllLandingPage,
  getDetailLandingPage,
  signup,
  signin,
  activeParticipant,
  checkout,
  getAllPayment,
  getDashboard,
} from './controller';

import { authenticateParticipant } from '../../../middlewares/auth';

router.get('/events', getAllLandingPage);
router.get('/events/:id', getDetailLandingPage);
router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.put('/active', activeParticipant);
router.get('/payments', getAllPayment);
router.get('/payments/:organizer', getAllPayment);
router.post('/checkout', authenticateParticipant, checkout);
router.get('/orders', authenticateParticipant, getDashboard);

export default router;
