// ImageGallery.tsx
import React, { useEffect, useState } from "react";
import storage from "./firebase"; // Firebaseの設定をインポート
import { listAll, ref, getDownloadURL } from "firebase/storage";

const ImageGallery: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imagesRef = ref(storage, "image/"); // 画像が保存されているパスを指定

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await listAll(imagesRef); // すべてのファイルをリストする
        const urls: string[] = await Promise.all(
          response.items.map((item) => getDownloadURL(item)) // 各ファイルのダウンロードURLを取得
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: "300px", height: "300px", objectFit: "cover", margin: "10px" }} />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
