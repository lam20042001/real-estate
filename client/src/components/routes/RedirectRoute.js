import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectRoute() {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000);
        count === 0 && navigate("/");
        return () => clearInterval(interval);
    }, [count]);
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h2>Please login. Redirecting in {count} second.</h2>
        </div>
    );
}
