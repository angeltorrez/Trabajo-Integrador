import express from 'express';
import TodoModel from '../models/Todo.js';
import { verifyToken } from './auth.js';
import { asyncHandler } from '../utils.js';

const router = express.Router();

router.get(
  '/get',
  asyncHandler(async (req, res) => {
    const todos = await TodoModel.find().lean();
    return res.json(todos);
  })
);

router.post(
  '/add',
  verifyToken,
  asyncHandler(async (req, res) => {
    const task = req.body.task;
    const role = req.rol || '';
    if (!task || !task.toString().trim()) return res.status(400).json({ message: 'Task required' });

    const created = await TodoModel.create({ task: task.toString().trim(), role });
    return res.json(created);
  })
);

router.put(
  '/update/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await TodoModel.findByIdAndUpdate(id, { completed: true }, { new: true }).lean();
    return res.json(updated);
  })
);

router.delete(
  '/delete/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await TodoModel.findByIdAndDelete(id).lean();
    return res.json(deleted);
  })
);

export default router;
