import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageCarousel from "../components/misc/ImageCarousel";
import Logo from "../logo.svg";
import dayjs from "dayjs";
import Like from "../components/misc/Like";
import ContactSeller from "../components/forms/ContactSeller";
import relativeTime from "dayjs/plugin/relativeTime";
import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi";
dayjs.extend(relativeTime);

const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export default function AdView() {
    const [ad, setAd] = useState({});
    const params = useParams();
    useEffect(() => {
        if (params?.slug) fetchAd();
    }, [params?.slug]);
    const fetchAd = async () => {
        try {
            const { data } = await axios.get(`/ad/${params.slug}`);
            setAd(data?.ad);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div className="container center">
                <div className="row mt-2 justify-content-center gap-4">
                    <div className="col-lg-5 border border-2 rounded pt-2">
                        <div className="">
                            <ImageCarousel photos={ad.photos} />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary disabled mt-2">
                                For {ad.action}
                            </button>
                            <Like ad={ad} />
                        </div>
                        <div className="mt-4 mb-4">
                            {ad?.sold ? "❌ Off market" : "✅ In market"}
                        </div>
                        <h1 className="mt-3 text-bold fw-bold">${formatNumber(ad.price)}</h1>
                        <h3>{ad.address}</h3>
                        
                        <p className="text-muted">{dayjs(ad?.createdAt).fromNow()}</p>
                        <p className="card-text d-flex justify-content-between">
                            <span>
                                <IoBedOutline /> {ad?.bedrooms}
                            </span>
                            <span>
                                <TbBath /> {ad?.bathrooms}
                            </span>
                            <span>
                                <BiArea /> {ad?.landsize} <span>m&sup2;</span>
                            </span>
                        </p>

                        <hr />
                        <h3 className="fw-bold">{ad?.title}</h3>
                        <p>
                            {ad?.description}
                        </p>
                    </div>
                    <div className="col-lg-4 ">
                        <div className="container border border-1 rounded-3 ">
                            <ContactSeller ad={ad} />
                        </div>
                    </div>
                </div>
            </div>
        

        </>
    );
}