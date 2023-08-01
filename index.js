const express = require('express');
const cors = require('cors');
const port = 8000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routerAuth = require('./routers/auth');
const routerUser = require('./routers/user');
const routerEmployee = require('./routers/employee');
const routerDepartment = require('./routers/department');

dotenv.config();
const app = express();

app.get('/', function (req, res) {
    res.json({ message: 'Server has started running', status: 'Running' });
});

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES USER
mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected!'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api/v1/auth', routerAuth);
app.use('/api/v1/user', routerUser);
app.use('/api/v1/employee', routerEmployee);
app.use('/api/v1/department', routerDepartment);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
