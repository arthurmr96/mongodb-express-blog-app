var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');

var postsApiRouter = require('./routes/api/posts');
var commentsApiRouter = require('./routes/api/comments');
var usersApiRouter = require('./routes/api/users');
var swaggerSpec = require('./swagger');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/posts', postsApiRouter);
app.use('/api/users', usersApiRouter);
app.use('/api', commentsApiRouter);

module.exports = app;
