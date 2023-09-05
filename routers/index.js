const routerAuth = require('./container/auth');
const routerUser = require('./container/user');
const routerCategory = require('./container/category');
function route(app) {
    app.use('/api/v1/auth', routerAuth);
    app.use('/api/v1/user', routerUser);
    app.use('/api/v1/category', routerCategory);
}
module.exports = route;
