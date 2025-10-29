import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

function createToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret'
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' })
}

export async function register(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  const existing = await User.findOne({ where: { email } })
  if (existing) return res.status(409).json({ message: 'Email already registered' })
  const passwordHash = await User.hashPassword(password)
  const user = await User.create({ email, passwordHash })
  const token = createToken(user.id.toString())
  res.status(201).json({ token, user: { id: user.id, email: user.email } })
}

export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await user.comparePassword(password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = createToken(user.id.toString())
  res.json({ token, user: { id: user.id, email: user.email } })
}

export async function verifyToken(req, res) {
  const user = await User.findByPk(req.userId)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({ id: user.id, email: user.email })
}


