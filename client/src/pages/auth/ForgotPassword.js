import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/forgot-password`, { email });
            if (data?.error) {
                toast.error(data.error);
                setLoading(false)
            }
            else {
                toast.success("Please check your mail to reset your password.");
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
            <h1 className="display-1 bg-secondary ">Forgot password</h1>
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
                            <button disabled={loading} className="btn btn-primary col-12 mb-4" type="submit">{loading ? "Waiting" : "Submit"}</button>
                        </form>
                        <Link className="text-danger" to="/login">Back to login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}