require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todo');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/todos', todoRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
    