const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 50 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 50 },
  username: { type: String, required: true, minLength: 5, maxLength: 20 },
  membership_status: { type: Boolean, required: true },
  password: { type: String, required: true, minLength: 10, maxLength: 100 },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

UserSchema.virtual("name").get(function () {
  let fullName = "";

  if (this.first_name && this.last_name) {
    fullName = `${this.first_name} ${this.last_name}`;
  }

  return fullName;
});

module.exports = mongoose.model("User", UserSchema);
