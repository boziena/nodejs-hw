import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
} from '../controllers/authController.js';

import { resetPassword } from '../controllers/authController.js';
import { resetPasswordSchema } from '../validations/authValidation.js';

const router = Router();

// Регістрація
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// Логін
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// Оновлення сесії
router.post('/auth/refresh', refreshUserSession);

// Логаут користувача
router.post('/auth/logout', logoutUser);

// Ресет 1
router.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);

// Ресет 2
router.post(
  '/auth/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);

export default router;
