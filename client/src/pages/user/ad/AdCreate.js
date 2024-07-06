import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/nav/Sidebar"; 
export default function AdCreate() {
    const navigate = useNavigate();
    return (
        <div>
            <h1 className="display-1 bg-primary text-light p-5">Create Ad</h1>
            <Sidebar />
            <div className="d-flex justify-content-center align-items-center gap-5 mt-4">
                <div className="col-lg-2">
                    <button onClick={() => navigate('sell')} className='btn btn-primary btn-lg col-12 p-5'>Sell</button>
                </div>
                <div className="col-lg-2">
                    <button onClick={() => navigate('rent')} className='btn btn-primary btn-lg col-12 p-5'>Rent</button>
                </div>
            </div>
        </div>
    )
}