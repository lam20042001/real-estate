import SearchForm from "../components/forms/SearchForm";
import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../components/cards/AdCard";
export default function Home() {

    const [adsForSell, setAdsForSell] = useState();
    const [adsForRent, setAdsForRent] = useState();
    const fetchAds = async () => {
        try {
            const { data } = await axios.get("/ads");
            setAdsForSell(data.adsForSell);
            setAdsForRent(data.adsForRent);
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
                    {adsForSell?.map((ad) => (
                        <AdCard ad={ad} toUrl={`/ad/${ad.slug}`} key={ad._id} />
                    ))}
                </div>
            </div>
            <h1 className="display-1 bg-primary text-light p-5">For Rent</h1>
            <div className="container">
                <div className="row">
                    {adsForRent?.map((ad) => (
                        <AdCard ad={ad} toUrl={`/ad/${ad.slug}`} key={ad._id} />
                    ))}
                </div>
            </div>
        </div>
    );
}