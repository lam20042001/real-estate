import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthStore } from '../components/store/AuthStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useSelector((state) => state);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/login`, { email, password });
            console.log('login')
            if (data?.error) {
                toast.error(data.error);
                setLoading(false)
            }
            else {
                dispatch(setAuthStore(data))
                localStorage.setItem("auth", JSON.stringify(data));
                toast.success("Successfully logged in.");
                setLoading(false);
                navigate('/');
                location?.state ? navigate(location.state) : navigate('/dashboard');
            }
        }
        catch (error) {
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    }
    return (
        <div>
            <h1 className="display-1 bg-secondary ">Login</h1>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 offset-lg-4">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="form-control mb-4"
                                placeholder="Enter your mail"
                                required
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control mb-4"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button disabled={loading} className="btn btn-primary col-12 mb-4" type="submit">{loading ? "Waiting" : "Login"}</button>
                        </form>
                        <Link className="text-danger" to="/auth/password-reset">Forgot password</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}