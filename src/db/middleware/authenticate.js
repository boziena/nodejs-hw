import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  // check наявність кукі
  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  // знайшов - шукай сесію
  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  // якщо сесії нема - помилка
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // перевірка терміну дії access токена
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  // Якщо все ок - шукаємо користувача
  const user = await User.findById(session.userId);

  // користувача не знайдено - помилка
  if (!user) {
    throw createHttpError(401);
  }

  // Якщо є, додаємо його до запиту
  req.user = user;

  // штовхаємо далі
  next();
};
