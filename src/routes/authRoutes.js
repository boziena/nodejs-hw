import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import * as ctrl from '../controllers/authController.js';
import { ctrlWrapper } from '../middleware/errorHandler.js';

const router = Router();

router.post(
  '/register',
  celebrate({ body: registerUserSchema }),
  ctrlWrapper(ctrl.registerUser),
);
router.post(
  '/login',
  celebrate({ body: loginUserSchema }),
  ctrlWrapper(ctrl.loginUser),
);
router.post('/logout', ctrlWrapper(ctrl.logoutUser));
router.post('/refresh', ctrlWrapper(ctrl.refreshUserSession));

export default router;
