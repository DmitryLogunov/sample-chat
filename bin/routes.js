'use strict';

const routes = require('next-routes');

module.exports = routes()
  .add('auth', '/', 'index')
  .add('chat', '/:resource_type(maintenance|incident)/:resource_id(\\d+)', 'chat')
  .add('home', '/home', 'home')