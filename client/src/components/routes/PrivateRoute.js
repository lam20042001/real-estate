import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
export default function PrivateRoute() {
    const auth = useSelector((state) => state);

    const [ok, setOk] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (auth?.token) {
            getCurrentUser();
        } else navigate("/login");
    }, [auth?.token]);
    const getCurrentUser = async () => {
        try {
            const { data } = await axios.get("/current-user", {
                Headers: {
                    Authorization: `${auth?.token}`,
                },
            }
            );
            if (data?.error) {
                setOk(false);
            } else {
                setOk(true);
            }
        } catch (error) {
            setOk(false);
        }

    }
    return ok ? <Outlet /> : null;
}
