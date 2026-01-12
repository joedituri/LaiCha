import { Link } from "react-router";
import "../css/Navbar.css"

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/" className="brand-text">
                <span className="brand-name">LAICHA</span>
                <span className="brand-subtitle">Bakehouse</span>
            </Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/order" className="nav-link">Order</Link>
            <a 
                href="https://www.instagram.com/laichabakehouse/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link instagram-link"
            >
                <span className="instagram-icon"></span> Instagram
            </a>
        </div>
    </nav>
}


export default NavBar