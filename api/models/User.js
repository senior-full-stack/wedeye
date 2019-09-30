const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs"),
  userSchema = new mongoose.Schema({
    type: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    pincode: { type: String },
    age: { type: Number },
    personalPhoto: { type: String },
    userType: { type: String },
    relationship: { type: String },
    weddingPhoto: { type: String },
    weddingDate: { type: Date },
    color: { type: String },
    locationLatitude: { type: String },
    locationLongitude: { type: String },
    locationAddress: { type: String },
    partnerPhoto: { type: String },
    partnerType: { type: String },
    partnerAge: { type: Number },
    partnerCountry: { type: String },
    partnerState: { type: String },
    partnerCity: { type: String },
    partnerPincode: { type: String },
    partnerAddressLine1: { type: String },
    partnerAddressLine2: { type: String },
    status: { type: String },
    isActive: { type: String },
    createdDate: { type: Date },
    createdBy: { type: String },
    modifiedDate: { type: Date },
    modifiedBy: { type: String },
    noOfRequestSent: { type: String },
    isPaidUser: { type: String },
    amountPaid: { type: Number },
    paidDate: { type: Date }
  });

// adds a method to a user document object to create a hashed password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// adds a method to a user document object to check if provided password is correct
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// middleware: before saving, check if password was changed,
// and if so, encrypt new password before saving:
userSchema.pre("save", function(next) {
  var moment = require("moment");

  if (!this.createdDate) {
    this.createdDate = moment().format("YYYY-MM-DD");
  } else {
    this.modifiedDate = moment().format("YYYY-MM-DD");
  }

  if (this.isModified("password")) {
    this.password = this.generateHash(this.password);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
