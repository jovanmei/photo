# 后端服务器照片存储指南 (开源优先)

## 概述

当前应用使用纯前端存储方式，上传的照片通过 `URL.createObjectURL()` 创建临时 blob URL，只在当前会话有效。为了实现持久化存储，需要部署后端服务器。

本指南优先推荐完全开源的解决方案，确保您的项目始终保持自由和可控。

---

## 开源方案推荐 (优先)

### 方案一：Node.js + Express (最推荐，100% 开源)

这是最灵活且完全开源的解决方案，所有依赖都是开源软件。

#### 1. 初始化后端项目

```bash
mkdir photo-gallery-backend
cd photo-gallery-backend
npm init -y
npm install express multer cors dotenv
```

所有使用的开源依赖：
- **express**: MIT 许可证，快速、非侵入式的 Web 框架
- **multer**: MIT 许可证，Express 中间件，用于处理 `multipart/form-data`
- **cors**: MIT 许可证，跨域资源共享中间件
- **dotenv**: BSD-2-Clause 许可证，环境变量管理

#### 2. 创建后端服务器文件 `server.js`

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('只支持图片文件'));
    }
  }
});

app.post('/api/upload', upload.array('photos', 20), (req, res) => {
  try {
    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      url: `http://localhost:${PORT}/uploads/${file.filename}`,
      name: file.originalname,
      uploadDate: new Date().toISOString()
    }));
    
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});
```

#### 3. 更新前端代码

修改 `src/app/views/AlbumManagementView.tsx` 中的文件上传逻辑：

```typescript
const handleFileUpload = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0 || !selectedAlbum) return;

  setUploading(true);
  setErrors({});

  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      const newPhotos: Photo[] = result.files.map(file => ({
        id: file.id,
        url: file.url,
        name: file.name,
        uploadDate: new Date(file.uploadDate)
      }));
      addPhotosToAlbum(selectedAlbum, newPhotos);
    } else {
      setErrors({ files: result.error });
    }
  } catch (error) {
    setErrors({ files: "上传失败，请检查后端服务器是否运行" });
  } finally {
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
}, [selectedAlbum, addPhotosToAlbum]);
```

---

### 方案二：使用 Docker + 开源对象存储 (MinIO)

完全开源的自托管对象存储解决方案，类似于 S3 但完全开源。

#### 1. 使用 Docker 运行 MinIO

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=password123 \
  minio/minio server /data --console-address ":9001"
```

MinIO 使用 GNU Affero General Public License v3.0，100% 开源。

#### 2. 连接到 MinIO

```bash
npm install @aws-sdk/client-s3
```

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: "password123",
  },
  forcePathStyle: true,
});

const uploadToMinIO = async (file: File, key: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const command = new PutObjectCommand({
    Bucket: "photo-gallery",
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });
  
  await s3Client.send(command);
  return `http://localhost:9000/photo-gallery/${key}`;
};
```

---

### 方案三：使用开源云存储替代方案

#### 选项 A：Seafile (GPLv3 许可证)
- 官网：https://www.seafile.com/
- 完全开源的企业级云存储
- 支持文件同步、共享和协作
- 可以自托管

#### 选项 B：Nextcloud (AGPL 许可证)
- 官网：https://nextcloud.com/
- 完全开源的云存储和协作平台
- 强大的应用生态系统
- 可以自托管

---

## 数据库集成 (开源优先)

为了完整的数据持久化，建议添加数据库，所有推荐都是开源数据库：

### 使用 SQLite (轻量级，100% 开源)
```bash
npm install sqlite3
```
- SQLite 是完全开源的公共域软件
- 零配置，不需要服务器
- 适合中小型应用

### 使用 PostgreSQL (PostgreSQL 许可证)
```bash
npm install pg
```
- 世界上最先进的开源关系型数据库
- PostgreSQL 许可证，完全开源
- 适合大规模应用

### 使用 MongoDB (SSPL 许可证)
```bash
npm install mongodb
```
- 流行的 NoSQL 数据库
- 适合文档存储
- 社区版完全开源

---

## 部署建议 (开源优先)

### 开发环境
1. 本地运行后端服务器 (`node server.js`)
2. 前端运行在 Vite 开发服务器
3. 使用 CORS 处理跨域请求

### 生产环境 (开源托管选项)

#### 选项 1：Vercel + Railway
- Vercel：托管前端（免费层可用）
- Railway：托管 Node.js 后端和数据库（开源友好）

#### 选项 2：CapRover (100% 开源)
- 官网：https://caprover.com/
- 完全开源的 PaaS 解决方案
- 类似 Heroku，但完全开源和自托管
- 可以部署在任何服务器上

#### 选项 3：Coolify (100% 开源)
- 官网：https://coolify.io/
- 开源的 Heroku/Netlify/Vercel 替代方案
- 支持 Docker 和 Kubernetes
- 可以自托管

---

## 开源安全最佳实践

1. **文件验证**：始终验证上传的文件类型和大小
2. **访问控制**：添加用户认证和授权 (推荐使用 Passport.js 或 Auth.js，都是开源的)
3. **HTTPS**：生产环境始终使用 HTTPS (使用 Let's Encrypt，完全免费和开源)
4. **文件名清理**：防止路径遍历攻击
5. **速率限制**：防止滥用上传接口 (推荐使用 `express-rate-limit`，开源)

---

## 为什么选择开源方案？

1. **完全控制**：您拥有代码和数据的完全控制权
2. **无供应商锁定**：可以随时迁移到其他平台
3. **透明安全**：所有代码都是公开的，可以审计安全问题
4. **社区支持**：拥有活跃的开源社区提供支持和改进
5. **成本效益**：大多数开源方案都有免费使用的选项
6. **可定制**：可以根据您的需求自由修改和扩展

所有推荐的方案都是经过验证的、生产就绪的开源解决方案！
