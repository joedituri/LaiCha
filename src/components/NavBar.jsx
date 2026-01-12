import { Link } from "react-router";
import "../css/Navbar.css"

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">Lai Cha</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/order" className="nav-link">Order</Link>
        </div>
    </nav>
}

export default NavBar