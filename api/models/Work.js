const
	mongoose = require('mongoose'),
	vPolicySchema = new mongoose.Schema({
        vendorId: { type: String },
        title: { type: String },
        category: { type: String },
        description: { type: String },
        createdDate: { type: String }
    })

vPolicySchema.pre('save', function (next) {
    var moment = require('moment');
    this.createdDate = moment().format('YYYY-MM-DD');

    next()
})
    
const vendorWork = mongoose.model('Vendor-Work', vPolicySchema)
module.exports = vendorWork