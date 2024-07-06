import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
const photos = [
    {
        original: "https://picsum.photos/id/1018/1000/600/",
        thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
        original: "https://picsum.photos/id/1015/1000/600/",
        thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
        original: "https://picsum.photos/id/1019/1000/600/",
        thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
];
export default function ImageCarousel({ photos }) {
    if (!photos) return ;
    photos = photos.map((image) => ({
        original: image,
        thumbnail: image.replace(
            'upload/',
            `upload/c_thumb,w_200,g_face/`
        )
    }));
    return <ImageGallery items={photos} />;
}
