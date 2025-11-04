const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
// USER MODEL SCHEMA - mongoose
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// AUTHENTICATION MODEL SCHEMA - (username & password) - mongoose
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
