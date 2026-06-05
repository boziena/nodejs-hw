import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // переконайтеся, що цей файл існує

const router = Router();
router.post(
  '/register',
  celebrate({ body: registerUserSchema }),
  ctrlWrapper(registerUser),
);
router.post(
  '/login',
  celebrate({ body: loginUserSchema }),
  ctrlWrapper(loginUser),
);
router.post('/logout', ctrlWrapper(logoutUser));
router.post('/refresh', ctrlWrapper(refreshUserSession));

export default router;
