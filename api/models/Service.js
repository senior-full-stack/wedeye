const
	mongoose = require('mongoose'),
	vServiceSchema = new mongoose.Schema({
        vendorId: { type: String },
        title: { type: String },
        category: { type: String },
        price: { type: String },
        description: { type: String },
        createdDate: { type: String }
    })

vServiceSchema.pre('save', function (next) {
    var moment = require('moment');
    this.createdDate = moment().format('YYYY-MM-DD');

    next()
})
    
const vendorService = mongoose.model('Vendor-Service', vServiceSchema)
module.exports = vendorService