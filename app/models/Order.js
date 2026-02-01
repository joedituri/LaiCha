import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: String,
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);