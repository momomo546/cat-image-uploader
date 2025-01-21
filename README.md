# cat image uploader
![Image](https://github.com/user-attachments/assets/79a84041-311b-4141-8a94-e637e1494c75)  
猫の画像のアップロードとアップロードされた画像を閲覧することができます。  
アップロードする際にバックエンドで機械学習モデルを使用して猫の検出を行っている。検出されなかった場合はアップロードすることができません。

## 使用技術
- Node.js  
- TypeScript  
- Python  
- FastAPI  
- tensorflow

## 機能一覧
- アップロード画像の取得・表示
- 画像のアップロード
  - 画像から猫の検出

## 起動方法（フロントエンド）
まず、srcディレクトリに移動
```cd
cd src
```
初回のみ以下を実行
```install
npm install
```
以下を実行し、http://localhost:3000/ に移動
```start
npm start
```
## 起動方法（バックエンド）
まず、backendディレクトリに移動
```cd
cd backend
```
初回のみ以下のコマンドを実行。http://localhost:8000/　で起動しているか確認できます。
```docker
docker build -t app .
```
```docker2
docker run -d -p 8000:8000 app
```
