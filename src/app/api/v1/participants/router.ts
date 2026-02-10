import express from 'express';
const router = express.Router();
import {
  getAllLandingPage,
  getDetailLandingPage,
  signup,
  signin,
  activeParticipant,
} from './controller';

router.get('/events', getAllLandingPage);
router.get('/events/:id', getDetailLandingPage);
router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.put('/active', activeParticipant);

export default router;
