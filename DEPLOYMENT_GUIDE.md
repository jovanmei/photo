# 项目部署指南

## 概述

本指南详细说明了如何将项目部署到 GitHub Pages，以及如何解决后端相关问题。

---

## 任务 1: 为 GitHub Pages 部署配置项目

### 步骤说明

1. **配置 Vite 构建工具**
   - 已更新 `vite.config.ts`，添加了 `base: './'` 配置
   - 这确保了相对路径在 GitHub Pages 上正确解析

2. **验证构建**
   ```bash
   npm run build
   ```

### 所需资源
- Node.js (推荐 v18+)
- npm 或 pnpm 包管理器

### 预期结果
- `dist/` 目录成功生成，包含所有静态资源

---

## 任务 2: 修复路由问题，使用 HashRouter 替代 BrowserRouter

### 步骤说明

1. **为什么使用 HashRouter？**
   - GitHub Pages 是纯静态托管，不支持客户端路由重定向
   - `createBrowserRouter` 在直接访问子路由时会返回 404
   - `createHashRouter` 使用 URL 哈希（如 `/#/admin`），完全兼容静态托管

2. **已完成的更改**
   - 更新了 `src/app/routes.tsx`
   - 从 `createBrowserRouter` 改为 `createHashRouter`

### 验证步骤
```bash
npm run dev
# 访问 http://localhost:5173/#/admin 测试路由
```

### 预期结果
- 所有路由正常工作，包括直接访问子路由

---

## 任务 3: 集成免费的图片托管解决方案（Cloudinary）

### Cloudinary 简介
- **免费额度**：每月 25 GB 存储，7500 次转换操作
- **可靠性**：企业级 CDN，全球加速
- **功能**：支持图片上传、转换、优化

### 实施步骤

1. **注册 Cloudinary 账户**
   - 访问 https://cloudinary.com/users/register_free
   - 免费注册，无需信用卡

2. **获取 API 凭证**
   - 登录后进入 Dashboard
   - 记录以下信息：
     - Cloud Name
     - API Key
     - API Secret

3. **安装 Cloudinary SDK**
   ```bash
   npm install cloudinary
   ```

4. **创建上传工具函数**
   
   创建 `src/utils/cloudinary.ts`：
   ```typescript
   import { v2 as cloudinary } from 'cloudinary';
   
   // 配置 Cloudinary（注意：在生产环境中应使用环境变量）
   cloudinary.config({
     cloud_name: 'YOUR_CLOUD_NAME',
     api_key: 'YOUR_API_KEY',
     api_secret: 'YOUR_API_SECRET'
   });
   
   export const uploadToCloudinary = async (file: File) => {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');
     
     const response = await fetch(
       `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
       {
         method: 'POST',
         body: formData
       }
     );
     
     return await response.json();
   };
   ```

5. **更新上传逻辑**
   
   修改 `AlbumManagementView.tsx` 中的文件上传功能。

### 所需资源
- Cloudinary 免费账户
- API 凭证

### 预期结果
- 图片成功上传到 Cloudinary
- 返回可访问的 CDN URL

---

## 任务 4: 创建部署指南文档（本文件）

### 使用说明

1. **安装 gh-pages 工具**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 package.json**
   ```json
   {
     "scripts": {
       "build": "vite build",
       "dev": "vite",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```

3. **构建并部署**
   ```bash
   npm run build
   npm run deploy
   ```

4. **配置 GitHub Pages**
   - 进入仓库 Settings
   - 找到 Pages 选项
   - 分支选择 `gh-pages`
   - 点击 Save

### 验证部署
- 访问 `https://yourusername.github.io/your-repo-name/`
- 测试所有功能

---

## 免费后端解决方案推荐：Firebase

### 概述
Firebase 是 Google 提供的完整后端即服务 (BaaS) 平台，提供免费额度，完美适合本项目。

### 为什么选择 Firebase？

✅ **完全免费的核心功能**
- Firebase Storage：5 GB 免费存储
- Firestore Database：1 GB 数据存储，50K 读取/天
- Hosting：静态托管
- Authentication：用户认证

✅ **高可靠性**
- Google 基础设施，99.9% SLA
- 全球 CDN 加速
- 自动扩展

✅ **易于集成**
- 官方 JavaScript SDK
- 完善的文档
- 活跃的社区支持

### 完整实施指南

#### 步骤 1：创建 Firebase 项目

1. 访问 https://console.firebase.google.com/
2. 点击 "Add project"
3. 输入项目名称，按照向导完成创建
4. 启用 Analytics（可选）

#### 步骤 2：配置 Firebase 服务

1. **启用 Firestore Database**
   - 在左侧菜单选择 Firestore Database
   - 点击 "Create database"
   - 选择 "Start in test mode"（生产环境需设置安全规则）
   - 选择地理位置

2. **启用 Storage**
   - 在左侧菜单选择 Storage
   - 点击 "Get started"
   - 同样选择 test mode 开始

3. **获取配置凭证**
   - 点击项目设置（齿轮图标）
   - 滚动到 "Your apps" 部分
   - 点击 "Add app" → 选择 Web 应用
   - 注册应用，获取配置对象：
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

#### 步骤 3：安装 Firebase SDK

```bash
npm install firebase
```

#### 步骤 4：创建 Firebase 配置文件

创建 `src/utils/firebase.ts`：

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase 配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID'
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 图片上传函数
export const uploadPhoto = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export default app;
```

#### 步骤 5：创建环境变量文件

创建 `.env.local`：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 步骤 6：更新 AlbumManagementView 集成 Firebase

修改 `src/app/views/AlbumManagementView.tsx`：

```typescript
import { uploadPhoto } from '../utils/firebase';

// ... 其他导入保持不变

const handleFileUpload = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0 || !selectedAlbum) return;

  setUploading(true);
  setErrors({});

  try {
    const newPhotos: Photo[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueId = generateId();
      const filePath = `photos/${selectedAlbum}/${uniqueId}-${file.name}`;
      
      // 上传到 Firebase Storage
      const url = await uploadPhoto(file, filePath);
      
      newPhotos.push({
        id: uniqueId,
        url,
        name: file.name,
        uploadDate: new Date()
      });
    }

    addPhotosToAlbum(selectedAlbum, newPhotos);

  } catch (error) {
    console.error('Upload failed:', error);
    setErrors({ files: "上传失败，请检查 Firebase 配置" });
  } finally {
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
}, [selectedAlbum, addPhotosToAlbum]);
```

#### 步骤 7：设置 Firestore 安全规则

在 Firebase Console 中，进入 Firestore Database → Rules：

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

**注意**：上述规则仅用于开发，生产环境应设置更严格的规则。

#### 步骤 8：设置 Storage 安全规则

在 Firebase Console 中，进入 Storage → Rules：

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### Firebase 方案的潜在限制

⚠️ **免费额度限制**
- Storage：5 GB 总存储
- Firestore：1 GB 数据，50K 读取/天，20K 写入/天
- 超出后需要升级到付费方案

⚠️ **供应商锁定**
- 深度集成 Firebase 后，迁移到其他平台需要重构

### 成功标准评估

✅ **功能验证**
- [ ] 图片能正常上传并显示
- [ ] 相册和照片数据能持久化保存
- [ ] 刷新页面后数据不丢失
- [ ] 编辑功能正常工作

✅ **性能指标**
- [ ] 图片加载时间 < 2 秒（全球范围内）
- [ ] 数据保存操作 < 500ms
- [ ] 无明显的卡顿或延迟

✅ **可靠性测试**
- [ ] 连续 7 天无服务中断
- [ ] 错误率 < 1%
- [ ] 数据一致性验证通过

---

## 常见问题解决

### 服务器错误

**问题**：500 错误或服务无响应

**解决方法**：
1. 检查 Firebase 控制台的 Status 页面
2. 验证 API 凭证是否正确
3. 检查浏览器控制台的错误信息
4. 查看 Firestore/Storage 的使用量是否超限

### 数据库连接问题

**问题**：无法连接到数据库

**解决方法**：
1. 验证 firebaseConfig 是否正确
2. 检查网络连接和防火墙设置
3. 确认安全规则允许访问
4. 启用调试日志：`firebase.database.enableLogging(true)`

### API 集成失败

**问题**：上传或保存操作失败

**解决方法**：
1. 检查 CORS 配置（Firebase 自动处理）
2. 验证文件大小是否在限制范围内
3. 检查 Storage 路径格式是否正确
4. 使用 try-catch 捕获详细错误信息

### 性能优化

**优化建议**：
1. **图片压缩**：上传前使用 `canvas` 压缩大图片
2. **懒加载**：使用 `loading="lazy"` 属性
3. **缓存策略**：利用 Firebase 的 CDN 缓存
4. **分页加载**：大量照片时分页获取

---

## 社区资源和支持

### 官方文档
- Firebase 文档：https://firebase.google.com/docs
- Cloudinary 文档：https://cloudinary.com/documentation

### 社区支持
- Stack Overflow：标签 `firebase`、`google-cloud-firestore`
- Reddit：r/firebase
- GitHub：firebase/firebase-js-sdk

### 学习资源
- Firebase YouTube 频道：https://www.youtube.com/c/Firebase
- Firebase Codelabs：https://firebase.google.com/codelabs

---

## 总结

使用 Firebase 作为免费后端解决方案是一个理想的选择，它提供了：
- ✅ 完全免费的核心功能
- ✅ 高可靠性和全球部署
- ✅ 易于集成和使用
- ✅ 完善的文档和社区支持

按照本指南实施后，您的项目将拥有完整的后端支持，可以完美部署到 GitHub Pages 或 Firebase Hosting！
