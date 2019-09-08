const
	mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	userSchema = new mongoose.Schema({
    name: { type: String, },
    relation: { type: String },
    profileUrl: { type: String },
		email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    address: { type: String, },
    phone: { type: String },
    type: { type: String },
    weddingDate: { type: String },
    createdDate: { type: String },
    status: { type: String }
	})

// adds a method to a user document object to create a hashed password
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// adds a method to a user document object to check if provided password is correct
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password)
}

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
userSchema.pre('save', function (next) {
  var moment = require('moment');

  this.createdDate = moment().format('YYYY-MM-DD hh:mm');
  this.weddingDate = this.weddingDate.replace(/T/, ' ');

	if(this.isModified('password')) {
		this.password = this.generateHash(this.password)
	}
	next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
