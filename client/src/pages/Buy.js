import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../components/cards/AdCard";
import SearchForm from "../components/forms/SearchForm";
export default function Buy() {

    const [ads, setAds] = useState();
    const fetchAds = async () => {
        try {
            const { data } = await axios.get("/ads-for-sell");
            setAds(data);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchAds();
    }, []);



    return (
        <div>

            <h1 className="display-1 bg-primary text-light p-5">For Sell</h1>
            <SearchForm />
            <div className="container">
                <div className="row">
                    {ads?.map((ad) => (
                        <AdCard ad={ad} toUrl={`/ad/${ad.slug}`} key={ad._id} />
                    ))}
                </div>
            </div>
        </div>
    );
}
