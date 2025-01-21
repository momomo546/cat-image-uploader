from http.client import HTTPException
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage, firestore
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image as PILImage
import io
from fastapi.middleware.cors import CORSMiddleware


cred = credentials.Certificate("./firebase_credentials.json")
firebase_admin.initialize_app(cred,{
    'storageBucket': 'image-uploader-c6dfc.appspot.com/image'
})

# Firestoreのクライアントを取得
db = firestore.client()

app = FastAPI()

# CORS設定の追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

model = tf.keras.applications.MobileNetV2(weights='imagenet')

# 画像処理関数
def prepare_image(image: PILImage.Image) -> np.ndarray:
    image = image.resize((224, 224))  
    image = np.array(image) / 255.0  
    image = np.expand_dims(image, axis=0) 
    return image

def upload_image_to_firebase(file: UploadFile):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(file.filename)
        blob.upload_from_string(
            file.file.read(),
            content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

# 画像のメタデータをFirestoreに保存する
def save_image_metadata(file_name: str, description: str, tags: list[str]):
    try:
        doc_ref = db.collection("images").document(file_name)
        doc_ref.set({
            "description": description,
            "tags": tags
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save metadata: {str(e)}")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/detect_cat/")
async def detect_cat(file: UploadFile = File(...)):
    if file.content_type.startswith('image/') is False:
        return JSONResponse(content={"error": "Invalid image format"}, status_code=400)

    image = PILImage.open(io.BytesIO(await file.read()))
    prepared_image = prepare_image(image)

    predictions = model.predict(prepared_image)
    decoded_predictions = tf.keras.applications.mobilenet.decode_predictions(predictions, top=3)[0]

    for _, label, _ in decoded_predictions:
        if 'cat' in label.lower():
            return JSONResponse(content={"detected": True})

    return JSONResponse(content={"detected": False})

@app.post("/upload_image/")
async def upload_image(
    file: UploadFile = File(...),
    description: str = Form(...),  
    tags: str = Form(...)  
):
    try:
        tags_list = tags.split(",") 
        # Firebase Storageに画像をアップロード
        # upload_image_to_firebase(file)
        # 画像のメタデータを保存
        save_image_metadata(file.filename, description, tags_list)

        return {"message": "Image uploaded and metadata saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
