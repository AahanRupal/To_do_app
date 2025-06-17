const Joi= require('joi');
const todoSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  completed: Joi.boolean().default(false),
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(3).max(100),
    completed: Joi.boolean(),
});

module.exports = {
  todoSchema, updateTodoSchema
};