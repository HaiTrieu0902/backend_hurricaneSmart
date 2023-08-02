const routerAuth = require('./container/auth');
const routerUser = require('./container/user');
const routerEmployee = require('./container/employee');
const routerDepartment = require('./container/department');
const routerMarriage = require('./container/marriage');

function route(app) {
    app.use('/api/v1/auth', routerAuth);
    app.use('/api/v1/user', routerUser);
    app.use('/api/v1/employee', routerEmployee);
    app.use('/api/v1/department', routerDepartment);
    app.use('/api/v1/marriage', routerMarriage);
}
module.exports = route;
