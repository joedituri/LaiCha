import { useState, useEffect } from 'react'
import FoodCard from '../components/FoodCard'
import '../css/Order.css'
import apiService from '../services/api'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Order() {
    const [cart, setCart] = useState([])
    const [menuItems, setMenuItems] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showPayment, setShowPayment] = useState(false)
    const [orderData, setOrderData] = useState(null)
    const [deliveryInfo, setDeliveryInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        deliveryDate: '',
        deliveryTime: '',
        specialInstructions: ''
    })

    // Fetch menu items from backend
    useEffect(() => {
        async function fetchMenu() {
            try {
                setLoading(true)
                const menu = await apiService.getMenu()
                setMenuItems(menu)
                setError(null)
            } catch (err) {
                console.error('Failed to fetch menu:', err)
                setError('Failed to load menu. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        fetchMenu()
    }, [])

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id)
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.id === item.id 
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ))
        } else {
            setCart([...cart, { ...item, quantity: 1 }])
        }
    }

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId))
    }

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(itemId)
        } else {
            setCart(cart.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ))
        }
    }

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setDeliveryInfo({ ...deliveryInfo, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (cart.length === 0) {
            alert('Please add items to your cart first!')
            return
        }

        const data = {
            customerInfo: {
                name: deliveryInfo.name,
                phone: deliveryInfo.phone,
                email: deliveryInfo.email,
                address: deliveryInfo.address,
                city: deliveryInfo.city,
                zipCode: deliveryInfo.zipCode
            },
            deliveryDate: deliveryInfo.deliveryDate,
            deliveryTime: deliveryInfo.deliveryTime,
            specialInstructions: deliveryInfo.specialInstructions,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }

        setOrderData(data)
        setShowPayment(true)
    }

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            const response = await apiService.createOrder({
                ...orderData,
                paymentIntentId
            })
            
            alert(`Order placed! Order ID: ${response.orderId}`)
            
            setCart([])
            setShowPayment(false)
            setDeliveryInfo({
                name: '', phone: '', email: '', address: '',
                city: '', zipCode: '', deliveryDate: '', deliveryTime: '',
                specialInstructions: ''
            })
        } catch (error) {
            alert('Failed to save order')
        }
    }

     // Category display names
    const categoryNames = {
        donuts: 'Donuts',
        croissants: 'Croissants',
        bread: 'Bread',
        dessert: 'Dessert'
    }

    // Category order
    const categoryOrder = ['donuts', 'croissants', 'bread','dessert']

    return (
        <div className="order-container">
            <section className="order-hero">
                <h1>Order for Delivery</h1>
                <p>Fresh baked goods delivered to your door</p>
            </section>

            <div className="order-content">
                {/* Menu Section */}
                <div className="menu-section">
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading menu...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        categoryOrder.map(category => (
                            menuItems[category] && menuItems[category].length > 0 && (
                                <div key={category} className="menu-category">
                                    <h2>{categoryNames[category]}</h2>
                                    <div className="menu-grid">
                                        {menuItems[category].map(item => (
                                            <div key={item.id} className="menu-item">
                                                <FoodCard 
                                                    name={item.name}
                                                    description={item.description}
                                                    image={item.image}
                                                    price={item.price}
                                                />
                                                <button 
                                                    className="add-to-cart-btn"
                                                    onClick={() => addToCart(item)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>

                {/* Checkout Section */}
                <div className="checkout-section">
                    <div className="checkout-sticky">
                        <h2>Your Order</h2>
                        
                        {cart.length === 0 ? (
                            <p className="empty-cart">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <div className="cart-item-info">
                                                <h4>{item.name}</h4>
                                                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="cart-item-controls">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="cart-total">
                                    <h3>Total: ${getTotal()}</h3>
                                </div>
                            </>
                        )}

                        <form onSubmit={handleSubmit} className="delivery-form">
                            <h3>Delivery Information</h3>
                            
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name *"
                                required
                                value={deliveryInfo.name}
                                onChange={handleInputChange}
                            />
                            
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number *"
                                required
                                value={deliveryInfo.phone}
                                onChange={handleInputChange}
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={deliveryInfo.email}
                                onChange={handleInputChange}
                            />
                            
                            <input
                                type="text"
                                name="address"
                                placeholder="Delivery Address *"
                                required
                                value={deliveryInfo.address}
                                onChange={handleInputChange}
                            />
                            
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City *"
                                    required
                                    value={deliveryInfo.city}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="zipCode"
                                    placeholder="Zip Code *"
                                    required
                                    value={deliveryInfo.zipCode}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <label htmlFor="deliveryDate">Delivery Date *</label>
                            <input
                                type="date"
                                name="deliveryDate"
                                id="deliveryDate"
                                required
                                value={deliveryInfo.deliveryDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                            />

                            <label htmlFor="deliveryTime">Preferred Delivery Time *</label>
                            <select
                                name="deliveryTime"
                                id="deliveryTime"
                                required
                                value={deliveryInfo.deliveryTime}
                                onChange={handleInputChange}
                            >
                                <option value="">Select time slot</option>
                                <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                                <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                                <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                            </select>
                            
                            <textarea
                                name="specialInstructions"
                                placeholder="Special Instructions (optional)"
                                rows="3"
                                value={deliveryInfo.specialInstructions}
                                onChange={handleInputChange}
                            />
                            
                            <button 
                                type="submit" 
                                className="place-order-btn"
                                style={{ display: showPayment ? 'none' : 'block' }}
                            >
                                Continue to Payment
                            </button>
                        </form>

                        {showPayment && (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm 
                                    amount={parseFloat(getTotal())} 
                                    onSuccess={handlePaymentSuccess}
                                />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order
