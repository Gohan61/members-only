const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 2, maxLength: 20 },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true, minLength: 5, maxLength: 1000 },
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("url").get(function () {
  return `/message/${this._id}`;
});

module.exports = mongoose.model("Messsage", MessageSchema);
