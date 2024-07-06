import axios from "axios";
import Resizer from "react-image-file-resizer";
import Avatar from "antd/lib/avatar/avatar";
export default function ProfileImageUpload({ photo, setPhoto, uploading, setUploading }) {
    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                1920,
                1080,
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
                setUploading(true);
            files.map(async (file) => {
                const image = await resizeFile(file);
                const { data } = await axios.post("upload-image", { image });
                setPhoto(data.data);
                setUploading(false);
            }
            )
        } catch (error) {
            setUploading(false);
            console.log(error);
        }
    }
    const handleDeleteImage = async (photo) => {
        const answer = window.confirm("Delete image?");
        if (!answer) return;
        setUploading(true);
        try {
            const { data } = await axios.post("/remove-image", photo);
            if (data?.ok) {
                setPhoto(null);
                setUploading(false);
            }
        } catch (err) {
            console.log(err);
            setUploading(false);
        }
    }
    return (<>
        <label className="btn btn-primary mb-4">
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleUploadImage} hidden />
        </label>
        {
            photo &&
            <Avatar src={photo} size={100} shape='square' className="mb-4" onClick={() => { handleDeleteImage(photo) }} />
        }</>
    )
}