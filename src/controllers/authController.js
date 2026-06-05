import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (await User.findOne({ email })) throw createHttpError(400, 'Email in use');
  const user = await User.create({
    email,
    password: await bcrypt.hash(password, 10),
  });
  const session = await createSession(user._id);
  setSessionCookies(res, session);
  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw createHttpError(401, 'Invalid credentials');
  await Session.deleteMany({ userId: user._id });
  const session = await createSession(user._id);
  setSessionCookies(res, session);
  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId)
    await Session.findByIdAndDelete(req.cookies.sessionId);
  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found');
  if (new Date() > session.refreshTokenValidUntil)
    throw createHttpError(401, 'Session token expired');

  await Session.deleteOne({ _id: sessionId });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ message: 'Session refreshed' });
};
