var UserController = require('./UserController.js');
var TopicController = require('./TopicController.js');

module.exports = function(app) {
    UserController(app);
    TopicController(app);
};