const express= require('express');
const validate = require('../Middleware/validate');
const { todoSchema, updateTodoSchema } = require('../schemas/todoSchema');  
const Todo = require('../models/todo');
const router = express.Router();

router.post('/', validate(todoSchema), async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).json({
            status: 'success',
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json({
            status: 'success',
            data: todos,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({
                status: 'error',
                message: 'Todo not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
});

router.put('/:id', validate(updateTodoSchema), async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {    
            new: true,
            runValidators: true,
        }); 
        if (!todo) {
            return res.status(404).json({
                status: 'error',
                message: 'Todo not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    } 
    });

    router.delete('/:id', async (req, res) => {
        try {
            const todo = await Todo.findByIdAndDelete(req.params.id);
            if (!todo) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Todo not found',
                });
            }
            res.status(204).json({
                status: 'success',
                message: 'Todo deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    });

    module.exports = router;
