import request from 'supertest'
import app from '../app.js'
import { sequelize } from '../config/db.js'
import { User, Task } from '../models/index.js'
import jwt from 'jsonwebtoken'

describe('Tasks API', () => {
  let authToken
  let userId

  beforeAll(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  beforeEach(async () => {
    await User.destroy({ where: {} })
    await Task.destroy({ where: {} })

    // Create a test user
    const user = await User.create({
      email: 'test@example.com',
      passwordHash: 'hashedpassword'
    })
    userId = user.id

    // Create auth token
    authToken = jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET || 'test-secret')
  })

  describe('GET /api/tasks', () => {
    it('should get tasks for authenticated user', async () => {
      // Create a test task
      await Task.create({
        userId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending'
      })

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0].title).toBe('Test Task')
    })

    it('should require authentication', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401)
    })
  })

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'pending'
      }

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201)

      expect(response.body.title).toBe(taskData.title)
      expect(response.body.description).toBe(taskData.description)
      expect(response.body.status).toBe(taskData.status)
      expect(response.body.userId).toBe(userId)
    })

    it('should require title', async () => {
      const taskData = {
        description: 'No title task'
      }

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400)

      expect(response.body.message).toBe('Title is required')
    })
  })

  describe('PUT /api/tasks/:id', () => {
    let taskId

    beforeEach(async () => {
      const task = await Task.create({
        userId,
        title: 'Original Task',
        description: 'Original Description',
        status: 'pending'
      })
      taskId = task.id
    })

    it('should update a task', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'completed'
      }

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.title).toBe(updateData.title)
      expect(response.body.status).toBe(updateData.status)
    })

    it('should not update task from another user', async () => {
      const otherUser = await User.create({
        email: 'other@example.com',
        passwordHash: 'hashedpassword'
      })

      const otherToken = jwt.sign({ sub: otherUser.id.toString() }, process.env.JWT_SECRET || 'test-secret')

      const updateData = {
        title: 'Hacked Task'
      }

      await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send(updateData)
        .expect(404)
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    let taskId

    beforeEach(async () => {
      const task = await Task.create({
        userId,
        title: 'Task to Delete',
        description: 'Will be deleted',
        status: 'pending'
      })
      taskId = task.id
    })

    it('should delete a task', async () => {
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      const task = await Task.findByPk(taskId)
      expect(task).toBeNull()
    })

    it('should not delete task from another user', async () => {
      const otherUser = await User.create({
        email: 'other@example.com',
        passwordHash: 'hashedpassword'
      })

      const otherToken = jwt.sign({ sub: otherUser.id.toString() }, process.env.JWT_SECRET || 'test-secret')

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(404)
    })
  })
})
