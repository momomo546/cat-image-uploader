import { Button } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import ImageLogo from "./image.svg";
import "./imageUpload.css";
import axios from 'axios';

const MAX_FILE_SIZE = 1 * 1024 * 1024;

type ImageUploaderProps = {
    onDataChange: (data: boolean) => void;
    onImageFile: (imageFile: File | null) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onDataChange, onImageFile }) => {
    const [sizeError, setSizeError] = useState(false);
    const [noCatError, setNoCatError] = useState(false);

    const onFileUploadToFirebase = async (e: ChangeEvent<HTMLInputElement>) => {
        setNoCatError(false)
        setSizeError(false)
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files[0].name);
            const file = e.target.files[0];

            // ファイルサイズを確認
            if (file.size > MAX_FILE_SIZE) {
                setSizeError(true);
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:8000/detect_cat/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // マルチパートデータとして送信
                    },
                });
                setNoCatError(!response.data.detected);
                if (response.data.detected) {
                    onImageFile(file);
                    onDataChange(false);
                }
            } catch (error) {
                console.error('Error uploading the file:', error);
                alert('ファイルのアップロード中にエラーが発生しました。');
                return;
            }
        };
    };

    return (
        <>
            <div className="outerBox">
                <div className="title">
                    <h2>画像アップローダー</h2>
                    <p>JpegかPngの画像ファイル</p>
                </div>
                <div className="imageUplodeBox">
                    <div className="imageLogoAndText">
                        <img src={ImageLogo} alt="imagelogo" />
                        <p>ここにドラッグ＆ドロップしてね</p>
                    </div>
                    <input
                        className="imageUploadInput"
                        multiple name="imageURL"
                        type="file"
                        onChange={onFileUploadToFirebase}
                        accept=".png, .jpeg, .jpg"
                    />
                </div>
                <p>または</p>
                <Button variant="contained">
                    ファイルを選択
                    <input
                        className="imageUploadInput"
                        type="file"
                        onChange={onFileUploadToFirebase}
                        accept=".png, .jpeg, .jpg"
                    />
                </Button>
                {sizeError ? (<p style={{ color: "red" }}>画像サイズが大きすぎます。2MB以下のファイルを選択してください。</p>) : (<></>)}
                {noCatError ? (<p style={{ color: "red" }}>猫が検出されませんでした。猫の写っている画像を選択してください。</p>) : (<></>)}
            </div>
        </>
    )
}


export default ImageUploader;
