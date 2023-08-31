const routerAuth = require('./container/auth');
const routerUser = require('./container/user');
function route(app) {
    app.use('/api/v1/auth', routerAuth);
    app.use('/api/v1/user', routerUser);
}
module.exports = route;
