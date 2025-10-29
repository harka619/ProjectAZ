import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js'

const router = Router()

router.use(authRequired)
router.get('/', listTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
