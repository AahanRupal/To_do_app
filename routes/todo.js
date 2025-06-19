const express = require('express');
const router = express.Router();

const Todo = require('../models/todo');
const validate = require('../Middleware/validate');
const verifyToken = require('../Middleware/authMiddleware');
const logger = require('../Middleware/logger');
const { todoSchema, updateTodoSchema } = require('../schemas/todoSchema');

// Create a new todo (protected + validated)
router.post('/', logger, verifyToken, validate(todoSchema), async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: req.body.completed || false,
      user: req.userId,
    });
    await todo.save();
    res.status(201).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all todos for the logged-in user
router.get('/', logger, verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.status(200).json({ status: 'success', data: todos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get a single todo (only if it belongs to the user)
router.get('/:id', logger, verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' });
    }
    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update a todo (only user's own todo)
router.put('/:id', logger, verifyToken, validate(updateTodoSchema), async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' });
    }
    res.status(200).json({ status: 'success', data: todo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Delete a todo (only user's own todo)
router.delete('/:id', logger, verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' });
    }
    res.status(204).json({ status: 'success', message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
