const routerAuth = require('./container/auth');
const routerUser = require('./container/user');
const routerCategory = require('./container/category');
const routerLimitation = require('./container/limitation');
function route(app) {
    app.use('/api/v1/auth', routerAuth);
    app.use('/api/v1/user', routerUser);
    app.use('/api/v1/category', routerCategory);
    app.use('/api/v1/limitation', routerLimitation);
}
module.exports = route;
