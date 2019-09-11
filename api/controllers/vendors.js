const Vendor = require('../models/Vendor.js'),
	Category = require('../models/Category'),
	signToken = require('../serverAuth.js').signToken,
	paginate = require('jw-paginate'),
    moment = require('moment');

module.exports = {
	// get one vendor
	show: (req, res) => {
		Vendor.findById(req.params.id, (err, vendor) => {
			return res.json(vendor)
		})
	},

	// search by title,
	search: (req, res) => {
		var vendors = [];
		var pageSize = 8;
		var page = req.params.page;
		var status = req.body.status;
		var searchText = req.body.searchText;

		if (searchText && searchText.trim()) {
			Vendor.find({"$or": [
				{"title": { '$regex' : searchText, '$options' : 'i' }},
				{"category": { '$regex' : searchText, '$options' : 'i' }},
				{"location": { '$regex' : searchText, '$options' : 'i' }},
				{"workingSince": { '$regex' : searchText, '$options' : 'i' }},
				]},
				(err, result) => {
					vendors = result;
	
					var pageOfItems = [];
	
					// filter vendors by the value of status
					if (status > 0 && status < 7) {
						const items = vendors;
	
						vendors = items.filter(item => parseInt(item.status) === status)
					} else if (status > 6) {
						var items = [];
	
						vendors.forEach( function(item) {
							const createdDate = moment(item.createdDate.toString());
							const now = moment();
							const diff = now.diff(createdDate, 'days');
					
							if (status === 7)  {
								if (Math.abs(diff) < 8) {
									return items.push(item);
								}
							} else if (status === 8) {
								if (Math.abs(diff) < 31) {
									return items.push(item);
								}
							}
						});
	
						vendors = items;
					}
	
					// get pager object for specified page
					const pager = paginate(vendors.length, page, pageSize, 4);
					// get page of items from items array
					pageOfItems = vendors.slice(pager.startIndex, pager.endIndex + 1)
	
					// return pager object and current page of items
					return res.json({ pager, pageOfItems });
				}
			).sort('-createdDate')
		} else {
			Vendor.find({}, (err, result) => {
				vendors = result;
				var pageOfItems = [];

				// filter vendors by the value of status
				if (status > 0 && status < 7) {
					const items = vendors;

					vendors = items.filter(item => parseInt(item.status) === status)
				} else if (status > 6) {
					var items = [];

					vendors.forEach( function(item) {
						const createdDate = moment(item.createdDate.toString());
						const now = moment();
						const diff = now.diff(createdDate, 'days');
				
						if (status === 7)  {
							if (Math.abs(diff) < 8) {
								return items.push(item);
							}
						} else if (status === 8) {
							if (Math.abs(diff) < 31) {
								return items.push(item);
							}
						}
					});

					vendors = items;
				}

				// get pager object for specified page
				const pager = paginate(vendors.length, page, pageSize, 4);
				// get page of items from items array
				pageOfItems = vendors.slice(pager.startIndex, pager.endIndex + 1);

				// return pager object and current page of items
				return res.json({pager, pageOfItems });
			}).sort('-createdDate')
		}
	},

	// create a new vendor
  	create: (req, res) => {
		Vendor.create(req.body, (err, vendor) => {
			if(err) return res.json({success: false, code: err.code})
			// once vendor is created, generate a token to "log in":
			const token = signToken(vendor)
			return res.json({success: true, message: "Vendor created. Token attached.", token})
		})
	},

	// update an existing vendor
  	update: (req, res) => {
		Vendor.findById(req.params.id, (err, vendor) => {
			Object.assign(vendor, req.body)
			vendor.save((err, vendor) => {
				return res.json({success: true, message: "Vendor updated.", vendor})
			})
		})
	},

	// delete an existing vendor
	destroy: (req, res) => {
		Vendor.findByIdAndRemove(req.params.id, (err, vendor) => {
			return res.json({success: true, message: "Vendor deleted.", vendor})
		})
	},

	vendorCategories: (req, res) => {
		vendorCategories = Category.vendorCategories();
		return res.json({success: true, message: "Vendor Categories", vendorCategories})
	},

	policyCategories: (req, res) => {
		policyCategories = Category.policyCategories();
		return res.json({success: true, message: "Policy Categories", policyCategories})
	},

	serviceAndPriceCategories: (req, res) => {
		serviceAndPriceCategories = Category.serviceAndPriceCategories();
		return res.json({success: true, message: "Service Categories", serviceAndPriceCategories})
	}
}
