import FoodCard from "../components/FoodCard"
import '../css/Home.css'


function Home() {
    const featuredItems = [
        {
            id: 1,
            name: "Glazed Donuts",
            description: "Light and fluffy donuts with our signature glaze",
            image: "🍩",
            price: 3.50
        },
        {
            id: 2,
            name: "Butter Croissant",
            description: "Flaky, buttery layers baked to golden perfection",
            image: "🥐",
            price: 4.50
        },
        {
            id: 3,
            name: "Sourdough Bread",
            description: "Artisan sourdough with a crispy crust",
            image: "🍞",
            price: 6.00
        },
        {
            id: 4,
            name: "Chocolate Croissant",
            description: "Buttery croissant filled with rich dark chocolate",
            image: "🥐",
            price: 5.00
        }
    ]

    return (
        <div className="home-container">
            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-content">
                    <h1>Artisan Baked Fresh Daily</h1>
                    <p>From our ovens to your table, experience the warmth of freshly baked goods</p>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-content">
                    <h2>Welcome to Lai Cha Bakehouse</h2>
                    <p>
                        We're passionate about creating the finest baked goods using traditional techniques 
                        and premium ingredients. Every donut, croissant, and loaf of bread is handcrafted 
                        with care and baked fresh daily in small batches.
                    </p>
                </div>
            </section>
            
            {/* Featured Items */}
            <section className="featured">
                <h2>Our Signature Bakes</h2>
                <div className="drink-grid">
                    {featuredItems.map(item => (
                        <FoodCard 
                            key={item.id}
                            name={item.name}
                            description={item.description}
                            image={item.image}
                            price={item.price}
                        />
                    ))}
                </div>
                <div className="view-all">
                </div>
            </section>

            {/* Info Banner */}
            <section className="info-banner">
                <div className="info-grid">
                    <div className="info-item">
                        <h3>Baked Fresh Daily</h3>
                        <p>Every item made fresh each morning</p>
                    </div>
                    <div className="info-item">
                        <h3>Quality Ingredients</h3>
                        <p>Premium flour, butter, and local ingredients</p>
                    </div>
                    <div className="info-item">
                        <h3>Artisan Crafted</h3>
                        <p>Traditional baking methods and techniques</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home