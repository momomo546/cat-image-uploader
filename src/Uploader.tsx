import React, { useState } from "react";
import ImageUploader from "./imageUploader";
import EditImageDescription from "./EditImageDescription";

const Uploader = () => {
    const [isUploaded, setIsUploaded] = useState(true);
    const [imageFile, setImageFile] = useState<File|null>(null);

    const handleDataChange = (data: boolean) => {
        setIsUploaded(data);
    }
    const handleImageFile = (file: File|null) => {
        setImageFile(file);
    }

    return (
        <>
            {isUploaded ?
                <ImageUploader onDataChange={handleDataChange} onImageFile={handleImageFile} /> :
                <EditImageDescription onDataChange={handleDataChange} imageFile = {imageFile}/>
            }
        </>
    );
}
export default Uploader