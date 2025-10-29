import { Task } from '../models/Task.js'

export async function listTasks (req, res) {
  const tasks = await Task.findAll({
    where: { userId: req.userId },
    order: [['createdAt', 'DESC']]
  })
  res.json(tasks)
}

export async function createTask (req, res) {
  const { title, description, status } = req.body
  if (!title) return res.status(400).json({ message: 'Title is required' })
  const task = await Task.create({
    userId: req.userId,
    title,
    description: description || '',
    status: status || 'pending'
  })
  res.status(201).json(task)
}

export async function updateTask (req, res) {
  const { id } = req.params
  const { title, description, status } = req.body
  const task = await Task.findOne({ where: { id, userId: req.userId } })
  if (!task) return res.status(404).json({ message: 'Task not found' })
  if (title !== undefined) task.title = title
  if (description !== undefined) task.description = description
  if (status !== undefined) task.status = status
  await task.save()
  res.json(task)
}

export async function deleteTask (req, res) {
  const { id } = req.params
  const task = await Task.findOne({ where: { id, userId: req.userId } })
  if (!task) return res.status(404).json({ message: 'Task not found' })
  await task.destroy()
  res.json({ message: 'Deleted' })
}
