const express = require('express');
const prisma = require('../prisma/client');
const validate = require('../Middleware/validate');
const verifyToken = require('../Middleware/authMiddleware');
const logger = require('../Middleware/logger');
const { todoSchema, updateTodoSchema } = require('../schemas/todoSchema');

const router = express.Router();

// Create todo
router.post('/', logger, verifyToken, validate(todoSchema), async (req, res) => {
    console.log("✅ Verified user ID:", req.userId);
  try {
    const todo = await prisma.todo.create({
      data: {
        title: req.body.title,
        completed: req.body.completed || false,
        user: { connect: { id: req.userId } },
      },
    });
    res.status(201).json({ data: todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all todos for logged-in user
router.get('/', logger, verifyToken, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId },
    });
    res.json({ data: todos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single todo
router.get('/:id', logger, verifyToken, async (req, res) => {
  try {
    const todo = await prisma.todo.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId,
      },
    });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ data: todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update todo
router.put('/:id', logger, verifyToken, validate(updateTodoSchema), async (req, res) => {
  try {
    const todo = await prisma.todo.updateMany({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId,
      },
      data: req.body,
    });
    if (todo.count === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete todo
router.delete('/:id', logger, verifyToken, async (req, res) => {
  try {
    const todo = await prisma.todo.deleteMany({
      where: {
        id: parseInt(req.params.id),
        userId: req.userId,
      },
    });
    if (todo.count === 0) return res.status(404).json({ error: 'Todo not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
