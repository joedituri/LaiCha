function FoodCard({ name, description, image, price }) {
    return (
        <div className="food-card">
            <div className="food-image">{image}</div>
            <h3>{name}</h3>
            <p>{description}</p>
            <span className="price">${price}</span>
        </div>
    )
}

export default FoodCard