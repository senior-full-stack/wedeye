const
	dotenv = require('dotenv').load(),
	express = require('express'),
  app = express(),
  PORT = process.env.PORT,
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	MONGODB_URI = process.env.MONGODB_URI,
  User = require('./models/User.js')
  usersRoutes = require('./routes/users.js'),
  AuthHttpInterceptor = require('./serverAuth')

mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, (err) => {
	console.log(err || `Connected to MongoDB.`)
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//create an admin account when user table of a database is empty
User.find({}, (err, users) => {
  if (users.length == 0) {
    const admin = {
      email: 'admin',
      password: 'admin',
      name: 'admin',
      type: 'admin'
    }
    User.create(admin, (err, user) => {
    });
  }
})

// Add a security filter to intercept and inspect requests for valid tokens.
app.use(AuthHttpInterceptor.intercept);
app.get('/api', (req, res) => {
	res.json({message: "API root."})
})

app.use('/api/users', usersRoutes)

app.listen(PORT, (err) => {
	console.log(err || `Server running on port ${PORT}.`)
})
