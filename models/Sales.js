const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  product: { type: String, required: true },
  category: { type: String, required: true },
  region: { type: String, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  revenue_file: { type: String, required: true }, // Save file path
});

module.exports = mongoose.model('Sales', SalesSchema);
