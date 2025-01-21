import React, { useEffect, useState } from 'react';
import ImageLogo from "./image.svg";
import "./imageUpload.css";
import storage from "./firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { Button } from "@mui/material";
import axios, { AxiosError } from 'axios';

type EditImageDescriptionProps = {
    onDataChange: (data: boolean) => void;
    imageFile: File | null;
};

const EditImageDescription: React.FC<EditImageDescriptionProps> = ({ onDataChange, imageFile }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(ImageLogo);
    const [message, setMessage] = useState("");
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string>('');

    const handleDataChange = () => {
        onDataChange(true);
    }
    const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }
    const handleTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTags(event.target.value);
    }
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if(description===""||tags==="")return;

        const formData = new FormData();
        if (imageFile) {
            formData.append('file', imageFile);
            formData.append('description', description);
            formData.append('tags', tags.split(',').map(tag => tag.trim()).join(',')); // カンマで区切ったタグを追加
        } else {
            setMessage('Please select a file');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/upload_image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 成功した場合のメッセージ
            console.log(response.data.message);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    console.log(`Error: ${err.response.data.detail || 'An error occurred'}`);
                } else {
                    console.log('Error: Unable to connect to the server');
                }
            }
        }
    };

    useEffect(() => {
        if (imageFile !== null) {
            const storageRef = ref(storage, "image/" + imageFile.name);
            const uploadImage = uploadBytesResumable(storageRef, imageFile);

            uploadImage.on(
                "state_changed",
                (snapshot) => {
                    setLoading(true);
                },
                (err) => {
                    console.log(err);
                },
                () => {
                    setLoading(false);
                    const previewUrl = URL.createObjectURL(imageFile);  // 画像のプレビューURLを生成
                    setImagePreview(previewUrl);
                }

            );
        }
    }, [imageFile]);

    return (
        <>
            {loading ? (<h2>ロード中・・・</h2>) : (
                <div className="outerBox">
                    <div className="imageLogoAndText">
                        <p>選択した画像</p>
                        <img src={imagePreview} alt="imagePreview" />
                    </div>
                    <Button onClick={handleDataChange}>別の画像を選ぶ</Button>
                    <form onSubmit={handleSubmit} className='imageForm'>
                        <label className='imageForm'>
                            Description:
                            <input type="text" name="description" value={description} onChange={handleDescription} />
                        </label>
                        <label className='imageForm'>
                            tags:
                            <input type="text" name="tags" value={tags} onChange={handleTags} />
                        </label>
                        <Button type="submit" className='formButton'>送信</Button>
                    </form>
                </div>
            )}
        </>
    );
}
export default EditImageDescription