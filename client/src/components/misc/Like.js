
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthStore } from "../store/AuthStore";
import axios from "axios";
import toast from "react-hot-toast";
export default function Like({ ad }) {
    const auth = useSelector((state) => state);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLike = async () => {
        try {
            if (auth.user === null) {
                navigate("/login", {
                    state: `/ad/${ad.slug}`,
                });
                return;
            }
            const { data } = await axios.post("/wishlist", { adId: ad._id });

            dispatch(setAuthStore({ user: data }))
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data;
            localStorage.setItem("auth", JSON.stringify(fromLS));
            toast.success("Added to wishlist");
        } catch (err) {
            console.log(err);
        }
    };
    const handleUnlike = async () => {
        try {
            if (auth.user === null) {
                navigate("/login", {
                    state: `/ad/${ad.slug}`,
                });
                return;
            }
            const { data } = await axios.delete(`/wishlist/${ad._id}`);

            dispatch(setAuthStore({ user: data }))
            const fromLS = JSON.parse(localStorage.getItem("auth"));
            fromLS.user = data;
            localStorage.setItem("auth", JSON.stringify(fromLS));
            toast.success("Removed from wishlist");
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            {auth.user?.wishlist?.includes(ad?._id) ? (
                <span>
                    <FcLike onClick={handleUnlike} className="h2 mt-3 pointer" />
                </span>
            ) : (
                <span>
                    <FcLikePlaceholder onClick={handleLike} className="h2 mt-3 pointer" />
                </span>
            )}
        </>
    );
}