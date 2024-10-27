import imageCompression from "browser-image-compression";


export const compressImage = async (croppedImage: Blob): Promise<Blob | null> => {
    try {
        const file = new File([croppedImage], "compressed_image.jpg", { type: "image/jpeg" });

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 500,
            useWebWorker: true,
            quality: 0.7,
        };

        const compressedBlob = await imageCompression(file, options);
        console.log("압축된 이미지 Blob:", compressedBlob);
        return compressedBlob;
    } catch (error) {
        console.error("이미지 압축 중 오류:", error);
        return null;
    }
};
