import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Order from './models/Order.js';
import MenuItem from './models/MenuItem.js';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/images", express.static("uploads"));

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all menu items (grouped by category)
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    
    // Group items by category
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        id: item._id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category
      });
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerInfo, items, deliveryDate, deliveryTime } = req.body;

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      address: customerInfo.address,
      city: customerInfo.city,
      zipCode: customerInfo.zipCode,
      deliveryDate,
      deliveryTime,
      items,
      total
    });

    await order.save();

    res.json({ success: true, orderId: order._id, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
