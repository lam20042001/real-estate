import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useDispatch } from "react-redux";
import { setAuthStore } from "../../components/store/AuthStore";
export default function AccessAccount() {
    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        requestAccess();
    }, [token]);

    const requestAccess = async () => {
        try {
            const { data } = await axios.post("/access-account", { resetCode: token });
            if (data?.error) {
                toast.error(data.error);
            } else {
                localStorage.setItem("auth", JSON.stringify(data));

                dispatch(setAuthStore(data))
                toast.success('Please update your password in profile.')
                navigate('/')
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (<div display-1 d-flex justify-content-between vh-100>account activate</div>)
}