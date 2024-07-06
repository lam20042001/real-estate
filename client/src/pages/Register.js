import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/pre-register`, { email, password });
            if (data?.error) {
                toast.error(data.error);
                setLoading(false)
            }
            else {
                toast.success("Please check your mail to confirm your registration.");
                setLoading(false);
                navigate('/')
            }
        }
        catch (error) {
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    }
    return (
        <div>
            <h1 className="display-1 bg-secondary ">Register</h1>
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
                            <button disabled={loading} className="btn btn-primary col-12 mb-4" type="submit">{loading ? "Waiting" : "Register"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}