import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import slugify from "slugify";
import Sidebar from "../../components/nav/Sidebar";
import ProfileImageUpload from "../../components/forms/ProfileImageUpload";
import { useSelector, useDispatch } from "react-redux";
import { setAuthStore } from "../../components/store/AuthStore";
export default function Profile() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state);

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    useEffect(() => {
        if (auth.user) {
            setUsername(auth.user?.username);
            setName(auth.user?.name);
            setEmail(auth.user?.email);
            setCompany(auth.user?.company);
            setAddress(auth.user?.address);
            setPhone(auth.user?.phone);
            setPhoto(auth.user?.photos);
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put("/update-profile", {
                username,
                name,
                email,
                company,
                address,
                phone,
                photo,
            });
            if (data?.error) {
                toast.error(data.error);
            } else {

                dispatch(setAuthStore({ user: data.user }));
                let userFromStorage = JSON.parse(localStorage.getItem("auth"));
                userFromStorage.user = data.user;
                localStorage.setItem("auth", JSON.stringify(userFromStorage));
                setLoading(false);
                toast.success("Profile updated");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <h1 className="display-1 bg-primary text-light p-5">Profile</h1>
            <div className="container-fluid">
                <Sidebar />
                <div className="container mt-2">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 mt-2">
                            <ProfileImageUpload
                                photo={photo}
                                setPhoto={setPhoto}
                                uploading={uploading}
                                setUploading={setUploading}
                            />
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Update your username"
                                    className="form-control mb-4"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(slugify(e.target.value.toLowerCase()))
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="form-control mb-4"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    className="form-control mb-4"
                                    value={email}
                                    disabled={true}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your company name"
                                    className="form-control mb-4"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your address"
                                    className="form-control mb-4"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Enter your phone"
                                    className="form-control mb-4"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary col-12 mb-4"
                                    disabled={loading}
                                >
                                    {loading ? "Processing" : "Update profile"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}