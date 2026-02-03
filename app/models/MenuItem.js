import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['donuts', 'croissants', 'bread','dessert']
  },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MenuItem', menuItemSchema);
