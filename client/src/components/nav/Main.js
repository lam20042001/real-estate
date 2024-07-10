import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDefault } from "../store/AuthStore";
export default function Main() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state);
    const dispatch = useDispatch();
    const logout = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        dispatch(setDefault());
        navigate("/");
    }
    const loggedIn = auth.user !== null && auth.token !== "" && auth.refreshToken !== "";
    const handlePostAdClick = () => {
        if (loggedIn) {
            navigate("ad/create");
        } else {
            navigate("/login");
        }
    }
    return (
        <nav className="nav d-flex justify-content-between lead">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" aria-current="page" to="/search">Search</NavLink>
            <NavLink className="nav-link" aria-current="page" to="/buy">Buy</NavLink>
            <NavLink className="nav-link" aria-current="page" to="/rent">Rent</NavLink>
            <NavLink className="nav-link" aria-current="page" to="/agents">Agents</NavLink>
            <NavLink className="nav-link" aria-current="page" to="/ad/create"> Post Ad</NavLink>
            {!loggedIn && <NavLink className="nav-link" to="/login">Login</NavLink>}
            {!loggedIn && <NavLink className="nav-link" to="/register">Register</NavLink>}
            {loggedIn && <div className="dropdown">
                <NavLink className="nav-link dropdown-toggle pointer" data-bs-toggle="dropdown" to="/profile">{auth?.user?.name ? auth?.user?.name : auth?.user?.username}</NavLink>
                <ul className="dropdown-menu">
                    <li>
                        <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                    </li>
                    <li>
                        <a onClick={logout} className="nav-link pointer" >Logout</a>
                    </li>
                </ul>
            </div>}
        </nav>
    )
}