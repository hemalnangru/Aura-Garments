const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  email: String,
  cart: Array,
  total: String,
  payment: String,
  status: {
    type: String,
    default: "Confirmed"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);