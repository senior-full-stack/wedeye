const
	mongoose = require('mongoose'),
	vendorSchema = new mongoose.Schema({
        title: { type: String, required: true },
        profileUrl: { type: String },
        category: { type: String, required: true },
        capacity: { type: String },
        location: { type: String },
        workingSince: { type: String },
        introduction: { type: String },
        storeType: { type: String },
        propertyType: { type: String },
        parkingFacility: { type: String },
        reviews: { type: Array },
        services: { type: Array },
        portfolio: { type: Array },
        status: { type: String },
        createdDate: { type: String }
    })

vendorSchema.pre('save', function (next) {
    var moment = require('moment');
    
    if (!this.createdDate) {
        this.createdDate = moment().format('YYYY-MM-DD');
    }

    next()
})
    
const Vendor = mongoose.model('Vendor', vendorSchema)
module.exports = Vendor