import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import ImageCarousel from "../../../components/misc/ImageCarousel";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../../../components/nav/Sidebar";
export default function AdEdit({ action }) {
    const [ad, setAd] = useState({
        _id: "",
        photos: [],
        uploading: false,
        price: "",
        address: "",
        bedrooms: "",
        bathrooms: "",
        landsize: "",
        title: "",
        description: "",
        loading: false,
        action: action,
    });
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        if (params?.slug) {
            fetchAd();
        }
    }, [params?.slug]);
    const fetchAd = async () => {
        try {
            const { data } = await axios.get(`/ad/${params.slug}`);
            setAd(data?.ad);
        } catch (err) {
            console.log(err);
        }
    };
    const handleClick = async () => {
        try {
            setAd({ ...ad, loading: true });
            const { data } = await axios.put(`/ad/${ad._id}`, ad);
            if (data?.error) {
                toast.error(data.error);
                setAd({ ...ad, loading: false });
            } else {
                toast.success("Ad updated successfully");
                setAd({ ...ad, loading: false });
                navigate("/dashboard");
            }
        } catch (err) {
            console.log(err);
            setAd({ ...ad, loading: false });
        }
    };
    const handleDelete = async () => {
        try {
            setAd({ ...ad, loading: true });
            const { data } = await axios.delete(`/ad/${ad._id}`);
            if (data?.error) {
                toast.error(data.error);
                setAd({ ...ad, loading: false });
            } else {
                toast.success("Ad deleted successfully");
                setAd({ ...ad, loading: false });
                navigate("/dashboard");
            }
        } catch (err) {
            console.log(err);
            setAd({ ...ad, loading: false });
        }
    };
    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Ad Edit</h1>
            <Sidebar />
            <div className="container">
                <div className="mb-3 form-control">
                    <ImageCarousel photos={ad?.photos} />
                </div>
                <input type="text"
                    className='form-control mb-3'
                    placeholder='Address'
                    value={ad.address}
                    onChange={(e) => setAd({ ...ad, address: e.target.value })} />

                <CurrencyInput
                    placeholder="Enter price"
                    defaultValue={10000}
                    className="form-control mb-3"
                    onValueChange={(value) => setAd({ ...ad, price: value })}
                />

                <input
                    type="number"
                    min="0"
                    className="form-control mb-3"
                    placeholder="Enter how many bedrooms"
                    value={ad.bedrooms}
                    onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
                />
                <input
                    type="number"
                    min="0"
                    className="form-control mb-3"
                    placeholder="Enter how many bathrooms"
                    value={ad.bathrooms}
                    onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
                />
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Size of land"
                    value={ad.landsize}
                    onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
                />
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter title"
                    value={ad.title}
                    onChange={(e) => setAd({ ...ad, title: e.target.value })}
                />
                <textarea
                    className="form-control mb-3"
                    placeholder="Enter description"
                    value={ad.description}
                    onChange={(e) => setAd({ ...ad, description: e.target.value })}
                />
                <div className="d-flex justify-content-between">
                    <button
                        onClick={handleClick}
                        className={`btn btn-primary mb-5 ${ad.loading ? "disabled" : ""}`}
                    >
                        {ad.loading ? "Saving..." : "Submit"}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`btn btn-danger mb-5 ${ad.loading ? "disabled" : ""}`}
                    >
                        {ad.loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}