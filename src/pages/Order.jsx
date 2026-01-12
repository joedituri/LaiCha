import { useState } from 'react'
import FoodCard from '../components/FoodCard'
import '../css/Order.css'

function Order() {
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)
    const [deliveryInfo, setDeliveryInfo] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        deliveryDate: '',
        deliveryTime: '',
        specialInstructions: ''
    })

    const menuItems = {
        donuts: [
            { id: 1, name: "Glazed Donut", description: "Classic glazed perfection", image: "🍩", price: 3.50, category: "donuts" },
            { id: 2, name: "Chocolate Donut", description: "Rich chocolate glazed", image: "🍩", price: 3.75, category: "donuts" },
            { id: 3, name: "Boston Cream", description: "Cream filled with chocolate", image: "🍩", price: 4.00, category: "donuts" },
            { id: 4, name: "Jelly Donut", description: "Filled with raspberry jam", image: "🍩", price: 3.75, category: "donuts" }
        ],
        croissants: [
            { id: 5, name: "Butter Croissant", description: "Flaky and buttery layers", image: "🥐", price: 4.50, category: "croissants" },
            { id: 6, name: "Chocolate Croissant", description: "Filled with dark chocolate", image: "🥐", price: 5.00, category: "croissants" },
            { id: 7, name: "Almond Croissant", description: "With almond cream filling", image: "🥐", price: 5.50, category: "croissants" },
            { id: 8, name: "Ham & Cheese Croissant", description: "Savory croissant", image: "🥐", price: 6.00, category: "croissants" }
        ],
        bread: [
            { id: 9, name: "Sourdough Loaf", description: "Artisan sourdough bread", image: "🍞", price: 6.00, category: "bread" },
            { id: 10, name: "Baguette", description: "Classic French baguette", image: "🥖", price: 4.50, category: "bread" },
            { id: 11, name: "Whole Wheat Bread", description: "Healthy whole grain", image: "🍞", price: 5.50, category: "bread" },
            { id: 12, name: "Focaccia", description: "Italian herb focaccia", image: "🍞", price: 7.00, category: "bread" }
        ]
    }

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
        // Here you would typically send the order to your backend
        alert(`Order placed! Total: $${getTotal()}\nDelivery Date: ${deliveryInfo.deliveryDate}\nDelivery Time: ${deliveryInfo.deliveryTime}`)
        console.log('Order details:', { cart, deliveryInfo, total: getTotal() })
    }

    return (
        <div className="order-container">
            <section className="order-hero">
                <h1>Order for Delivery</h1>
                <p>Fresh baked goods delivered to your door</p>
            </section>

            <div className="order-content">
                {/* Menu Section */}
                <div className="menu-section">
                    {/* Donuts */}
                    <div className="menu-category">
                        <h2>Donuts</h2>
                        <div className="menu-grid">
                            {menuItems.donuts.map(item => (
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

                    {/* Croissants */}
                    <div className="menu-category">
                        <h2>Croissants</h2>
                        <div className="menu-grid">
                            {menuItems.croissants.map(item => (
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

                    {/* Bread */}
                    <div className="menu-category">
                        <h2>Bread</h2>
                        <div className="menu-grid">
                            {menuItems.bread.map(item => (
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
                            
                            <button type="submit" className="place-order-btn">
                                Place Order - ${getTotal()}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order