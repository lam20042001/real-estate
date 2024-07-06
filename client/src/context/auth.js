import { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuthStore } from "../components/store/AuthStore";
import axios from "axios";
const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state);
    useEffect(() => {
        let authFromStorage = localStorage.getItem("auth");
        if (authFromStorage) dispatch(setAuthStore(JSON.parse(authFromStorage)));
    }, []);
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.headers.common["Authorization"] = auth?.token;
    axios.defaults.headers.common["Refresh-Token"] = auth?.refreshToken;
    axios.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            if (err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const { data } = await axios.get("/refresh-token");
                        axios.defaults.headers.common["token"] = data.token;
                        axios.defaults.headers.common["refresh_token"] = data.refreshToken;

                        dispatch(setAuthStore(data));
                        localStorage.setItem("auth", JSON.stringify(data));
                        return axios(originalConfig);
                    } catch (_error) {
                        if (_error.response && _error.response.data) {
                            return Promise.reject(_error.response.data);
                        }
                        return Promise.reject(_error);
                    }
                }
                if (err.response.status === 403 && err.response.data) {
                    return Promise.reject(err.response.data);
                }
            }
            return Promise.reject(err);
        }
    );


    return <>{children}</>;
}
export { AuthProvider };
