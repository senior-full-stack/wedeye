const
	express = require('express'),
	usersRouter = new express.Router(),
	usersCtrl = require('../controllers/users.js');

usersRouter.post('/', usersCtrl.create)

usersRouter.post('/auth', usersCtrl.authenticate)

usersRouter.post('/search/:page', usersCtrl.search)

usersRouter.route('/:id')
	.get(usersCtrl.show)
	.patch(usersCtrl.update)
	.delete(usersCtrl.destroy)

module.exports = usersRouter
