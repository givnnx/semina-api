import express from 'express';
const router = express.Router();
import { index } from './controller';

router.get(
  '/:refreshToken',
  index
);

export default router;
