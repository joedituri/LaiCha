const API_URL = 'http://localhost:5000';



function FoodCard({ name, description, image, price }) {
    return (
        <div className="food-card">
            <img src={`${API_URL}${image}`} />
            <h3>{name}</h3>
            <p>{description}</p>
            <span className="price">${price}</span>
        </div>
    )
}

export default FoodCard