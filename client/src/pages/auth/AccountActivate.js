import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthStore } from "../../components/store/AuthStore";
export default function AccountActivate() {
    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        requestActivation();
    }, [token]);
    const requestActivation = async () => {
        try {
            const { data } = await axios.post("/register", { token });
            if (data?.error) {
                toast.error(data.error);
            } else {
                localStorage.setItem("auth", JSON.stringify(data));
                dispatch(setAuthStore(data))
                toast.success('successfully logged in')
                navigate('/')
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (<div display-1 d-flex justify-content-between vh-100>account activate</div>)
}