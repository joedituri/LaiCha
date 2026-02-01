import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Order from './models/Order.js';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

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

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log('Creating payment intent for amount:', amount); // ADD THIS
    console.log('Amount in cents:', Math.round(amount * 100)); // ADD THIS

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    console.log('Payment intent created:', paymentIntent.id); // ADD THIS

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error); // ADD THIS
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});