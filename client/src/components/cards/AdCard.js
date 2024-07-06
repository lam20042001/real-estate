import { Badge } from "antd";
import { Link } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";
import { BiArea } from "react-icons/bi";
import { TbBath } from "react-icons/tb";
const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AdCard({ ad, toUrl }) {
    return (
        <div className="col-lg-4 p-4 gx-4 gy-4">
            <Link to={toUrl}>
                <Badge.Ribbon
                    text={ad?.action}
                    color={`${ad?.action === "Sell" ? "blue" : "red"}`}
                >
                    <div className="card hoverable shadow">
                        <img
                            src={ad?.photos?.[0]}
                            alt={`${ad?.address}-${ad?.action}-${ad?.price}`}
                            style={{ height: "250px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                            <h3>${formatNumber(ad?.price)}</h3>
                            <p className="card-text">{ad?.address}</p>
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
                        </div>
                    </div>
                </Badge.Ribbon>
            </Link>
        </div>
    );
}