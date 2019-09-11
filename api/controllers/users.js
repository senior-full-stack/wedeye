const User = require('../models/User.js'),
	signToken = require('../serverAuth.js').signToken,
	paginate = require('jw-paginate'),
	moment = require('moment');

module.exports = {
	// get one user
	show: (req, res) => {
		User.findById(req.params.id, (err, user) => {
			return res.json(user)
		})
	},

	// search by name, email, type, phone, address
	search: (req, res) => {
		var users = [];
		var pageSize = 8;
		var page = req.params.page;
		var status = req.body.status;
		var searchText = req.body.searchText;

		if (searchText && searchText.trim()) {
			User.find({"$or": [
				{"name": { '$regex' : searchText, '$options' : 'i' }},
				{"email": { '$regex' : searchText, '$options' : 'i' }},
				{"type": { '$regex' : searchText, '$options' : 'i' }},
				{"phone": { '$regex' : searchText, '$options' : 'i' }},
				{"address": { '$regex' : searchText, '$options' : 'i' }},
				]},
				(err, result) => {
					if(err) return res.json({success: false, code: err.code})

					users = result;
	
					var pageOfItems = [];
	
					// filter users by the value of status
					if (status > 0 && status < 7) {
						const items = users;
	
						users = items.filter(item => parseInt(item.status) === status)
					} else if (status === 7) {
						var items = [];
	
						users.forEach( function(item) {
							const createdDate = moment(item.createdDate.toString());
							const now = moment();
							const diff = now.diff(createdDate, 'days');
					
							if (Math.abs(diff) < 31) {
								return items.push(item);
							}
						});
	
						users = items;
					}
	
					// get pager object for specified page
					const pager = paginate(users.length, page, pageSize, 4);
					// get page of items from items array
					pageOfItems = users.slice(pager.startIndex, pager.endIndex + 1)
	
					// return pager object and current page of items
					return res.json({ pager, pageOfItems });
				}
			)
		} else {
			User.find({}, (err, result) => {
				if(err) return res.json({success: false, code: err.code})

				users = result;
				var pageOfItems = [];
	
				// filter users by the value of status
				if (status !== 0 && status !== 7) {
					const items = users;

					users = items.filter(item => parseInt(item.status) === status)
				} else if (status === 7) {
					var items = [];

					users.forEach( function(item) {
						const createdDate = moment(item.createdDate.toString());
						const now = moment();
						const diff = now.diff(createdDate, 'days');
				
						if (Math.abs(diff) < 31) {
							return items.push(item);
						}
					});

					users = items;
				}

				// get pager object for specified page
				const pager = paginate(users.length, page, pageSize, 4);
				// get page of items from items array
				pageOfItems = users.slice(pager.startIndex, pager.endIndex + 1)

				// return pager object and current page of items
				return res.json({ pager, pageOfItems });
			})
		}
	},

	// create a new user
  	create: (req, res) => {
		User.create(req.body, (err, user) => {
			if(err) return res.json({success: false, code: err.code})
			// once user is created, generate a token to "log in":
			const token = signToken(user)
			res.json({success: true, message: "User created. Token attached.", token})
		})
	},

	// update an existing user
  	update: (req, res) => {
		User.findById(req.params.id, (err, user) => {
			Object.assign(user, req.body)
			user.save((err, user) => {
				res.json({success: true, message: "User updated.", user})
			})
		})
	},

	// delete an existing user
	destroy: (req, res) => {
		User.findByIdAndRemove(req.params.id, (err, user) => {
			res.json({success: true, message: "User deleted.", user})
		})
	},

	// the login route
  	authenticate: (req, res) => {
		// check if the user exists
		User.findOne({email: req.body.email}, (err, user) => {
			// if there's no user or the password is invalid
			if(!user || !user.validPassword(req.body.password) || user.type !== 'admin') {
				// deny access
				return res.json({success: false, message: "Invalid credentials."})
			}

			const token = signToken(user)
			res.json({success: true, message: "Token attached.", token})
		})
	}
}
