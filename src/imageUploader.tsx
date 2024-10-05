import { Button } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import ImageLogo from "./image.svg";
import "./imageUpload.css";
import storage from "./firebase";
import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

const ImageUploader = () => {
    const [loading, setLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    const onFileUploadToFirebase = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files[0].name);
            const file = e.target.files[0];
            const storageRef = ref(storage, "image/" + file.name);
            // uploadBytes(storageRef, file).then((snapshot)=>{
            //   console.log("Uploaded");
            // });
            const uploadImage = uploadBytesResumable(storageRef, file);

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
                    setIsUploaded(true);
                }
            );
        };
    };

    return (
        <>
            {loading ? (<h2>アップロード中・・・</h2>) : (
                <>
                    {isUploaded ? (
                        <h2>アップロード完了！</h2>
                    ) : (
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
                        </div>
                    )}

                </>
            )}
        </>

    );
};

export default ImageUploader;
