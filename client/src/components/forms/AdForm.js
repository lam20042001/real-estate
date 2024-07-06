import CurrencyInput from 'react-currency-input-field';
import ImageUpload from './ImageUpload';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthStore } from '../store/AuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
export default function AdForm({ action }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ad, setAd] = useState({
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
    const handleClick = async () => {
        try {
            setAd({ ...ad, loading: true });
            const {data} = await axios.post("/create-ad", ad);
            if (data?.error) {
                setAd({ ...ad, loading: false });
                toast(data.error);
            } else {
                setAd({ ...ad, loading: false });
                dispatch(setAuthStore({user:data.user}));
                toast("Ad created");
                navigate('/dashboard')
            }
        } catch (error) {
            setAd({ ...ad, loading: false });
            toast("Error creating ad");
        }
    }
    return (<>
        <ImageUpload ad={ad} setAd={setAd} />
        <input type="text"
            className='form-control mb-3'
            placeholder='Address'
            value={ad.address}
            onChange={(e) => setAd({ ...ad, address: e.target.value })} />
        <CurrencyInput placeholder='Price'
            defaultValue={ad.price}
            className='form-control mb-3'
            onValueChange={(value) => setAd({ ...ad, price: value })}
        />
        <input type="number" min="0"
            className='form-control mb-3'
            placeholder='Number of bedrooms'
            value={ad.bedrooms}
            onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })} />
        <input type="number" min="0"
            className='form-control mb-3'
            placeholder='Number of bathrooms'
            value={ad.bathrooms}
            onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })} />
        <input type="number" min="0"
            className='form-control mb-3'
            placeholder='Size of land'
            value={ad.landsize}
            onChange={(e) => setAd({ ...ad, landsize: e.target.value })} />
        <input type="text"
            className='form-control mb-3'
            placeholder='Title'
            value={ad.title}
            onChange={(e) => setAd({ ...ad, title: e.target.value })} />
        <textarea className='form-control mb-3'
            placeholder='Description'
            value={ad.description}
            onChange={(e) => setAd({ ...ad, description: e.target.value })} />
        <button onClick={handleClick} className='btn btn-primary col-12'>{ad.loading ? "Saving" : "Submit"}</button>
    </>
    )
}