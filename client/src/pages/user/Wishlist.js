import { useState, useEffect } from "react";
import Sidebar from "../../components/nav/Sidebar";
import axios from "axios";
import AdCard from "../../components/cards/AdCard";
import { useSelector } from "react-redux";
export default function Wishlist() {
    const auth = useSelector((state) => state);

    const [ads, setAds] = useState([]);
    useEffect(() => {
        fetchAds();
    }, [auth.token !== ""]);
    const fetchAds = async () => {
        try {
            const { data } = await axios.get(`/wishlist`);
            setAds(data);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Wishlist</h1>
            <Sidebar />
            {!ads?.length ? (
                <div
                    className="d-flex justify-content-center align-items-center vh-100"
                    style={{ marginTop: "-10%" }}
                >
                    <h2>
                        You have not liked any properties yet!
                    </h2>
                </div>
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
                            <p className="text-center">
                                You have liked {ads?.length} properties
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        {ads?.map((ad) => (
                            <AdCard ad={ad} toUrl={`/ad/${ad.slug}`} key={ad._id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
