import axios from "axios";
import Resizer from "react-image-file-resizer";
import {Avatar} from "antd";
export default function ImageUpload({ ad, setAd }) {
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                1080,
                720,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });
    const handleUploadImage = async (e) => {
        try {
            let files = e.target.files;
            files = [...files]
            if (files?.length)
                setAd({ ...ad, uploading: true });
            files.map(async (file) => {
                const image = await resizeFile(file);
                const { data } = await axios.post("upload-image", { image });
                setAd((ad)=> ( {...ad, photos: [...ad.photos, data.data], uploading: false} ));
            }
            )
        } catch (error) {
            setAd({ ...ad, uploading: false });
            console.log(error);
        }
    }
    const handleDeleteImage = async (photo) => {
        const answer = window.confirm("Delete image?");
        if (!answer) return;
        setAd({ ...ad, uploading: true });
        try {
            const { data } = await axios.post("/remove-image", photo);
            if (data?.ok) {
                setAd((prev) => ({
                    ...prev,
                    photos: prev.photos.filter((p) => p !== photo),
                    uploading: false,
                }));
            }
        } catch (err) {
            console.log(err);
            setAd({ ...ad, uploading: false });
        }
    }
    return (<>
        <label className="btn btn-primary mb-4">
            {ad.uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleUploadImage} multiple hidden />
        </label>
        {
            ad?.photos.map((file,index) => {
                return <Avatar key={index} src={file} size={100} shape='square' className="mb-4" onClick={()=>{handleDeleteImage(file)}} />
            })
        }</>
    )
}