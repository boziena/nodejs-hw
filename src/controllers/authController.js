import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

// ?
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';

// ?
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

//! Регістрація
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  // Хеш пароля bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створює нового користувача в базі
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // Створюємо сесію
  const newSession = await createSession(user._id);

  // Додавання кукі до відповіді
  setSessionCookies(res, newSession);

  // Відповідь
  res.status(201).json(user);
};

//! Логін
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Видаляє стару сесію та створює нову
  await Session.deleteOne({ userId: user._id });

  const session = await createSession(user._id);

  // кукі до відповіді
  setSessionCookies(res, session);

  // відповідь
  res.status(200).json(user);
};

//! ротація токена за допомогою refresh-ток
//! дозволить користувачу залишатися авторизованим навіть після завершення терміну дії короткоживучого access-токена
export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  // Знаходимо сесію за id сесії та реф-токеном
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  // Якщо сесії нема, повертаємо - помилка
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Якщо сесія існує, перевіряємо валідність рефреш токена
  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();

  // Якщо термін дії рефреш токена вийшов,
  // видаляємо сесію і повертаємо помилку
  if (isSessionTokenExpired) {
    await session.deleteOne();
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw createHttpError(401, 'Session token expired');
  }

  // Якщо перевірки пройшли добре, видаляємо сесію
  await session.deleteOne();

  // Створюємо нову сесію
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

//! Логаут користувача
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//! ЗМІНА ПАРОЛЯ
export const requestResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  //шлях до шаблона
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  //Читаємо шаблон
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  //Готуємо шаблон до заповнення
  const template = handlebars.compile(templateSource);
  //Формуємо із шаблона HTML документ з динамічними даними
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      // ШАБЛОН HTML
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  //Перевіряємо/декодуємо токен
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Повертаємо помилку якщо проблема при декодуванні
    throw createHttpError(401, 'Invalid or expired token');
  }

  //Шукаємо user
  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  //Якщо існує
  //створюємо новий пароль і оновлюємо
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  //видаляємо попередні сесії
  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    message: 'Password reset successfully',
  });
};
