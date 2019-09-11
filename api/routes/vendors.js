const
	express = require('express'),
	vendorsRouter = new express.Router(),
	vendorsCtrl = require('../controllers/vendors.js');
	
vendorsRouter.post('/', vendorsCtrl.create)

vendorsRouter.post('/search/:page', vendorsCtrl.search)

vendorsRouter.get('/vendor-category', vendorsCtrl.vendorCategories)
vendorsRouter.get('/service-category', vendorsCtrl.serviceAndPriceCategories)
vendorsRouter.get('/policy-category', vendorsCtrl.policyCategories)

vendorsRouter.route('/:id')
	.get(vendorsCtrl.show)
	.patch(vendorsCtrl.update)
	.delete(vendorsCtrl.destroy)

module.exports = vendorsRouter
