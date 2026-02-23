# Cloudinary 配置指南

## 概述

本指南将帮助你配置 Cloudinary 作为照片存储后端，实现安全、可靠的照片上传和管理。

## 为什么选择 Cloudinary？

- ✅ **免费额度**：每月 25GB 存储 + 7500 次转换
- ✅ **全球 CDN**：自动优化和加速图片加载
- ✅ **图片处理**：自动调整大小、格式转换、压缩
- ✅ **安全可靠**：企业级安全和备份
- ✅ **易于集成**：简单的 API 和 SDK

---

## 第一步：注册 Cloudinary 账户

1. 访问 https://cloudinary.com/users/register_free
2. 使用邮箱或 GitHub 账号注册
3. 验证邮箱地址
4. 登录到 Cloudinary Dashboard

---

## 第二步：获取配置信息

### 1. Cloud Name

在 Dashboard 首页可以看到 **Cloud Name**，例如：`dxabc1234`

### 2. 创建 Upload Preset

Upload Preset 用于配置上传行为：

1. 进入 **Settings** → **Upload**
2. 滚动到 **Upload presets** 部分
3. 点击 **Add upload preset**
4. 配置以下设置：

```
Upload Preset Name: photo-gallery-unsigned
Signing Mode: Unsigned
Folder: photo-gallery
Unique filename: Enabled
Overwrite: Disabled
```

5. 点击 **Save**

### 3. 可选：获取 API 密钥（用于服务器端操作）

如果需要删除图片等服务器端操作：

1. 进入 **Settings** → **Account**
2. 在 **Account Details** 中查看：
   - API Key
   - API Secret

**⚠️ 警告**：API Secret 只能在服务器端使用，不要暴露在客户端代码中！

---

## 第三步：配置项目环境变量

1. 复制环境变量示例文件：

```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的配置：

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=photo-gallery-unsigned
```

---

## 第四步：验证配置

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问上传页面

1. 进入 Admin 页面 (`/#/admin`)
2. 点击 **BULK PHOTO UPLOAD**
3. 如果配置正确，将看到上传界面
4. 如果配置错误，将显示错误提示

### 3. 测试上传

1. 选择一个相册
2. 拖拽或点击选择图片文件
3. 点击上传按钮
4. 观察上传进度
5. 上传成功后，图片将显示在预览区域

---

## 第五步：GitHub Pages 部署配置

如果要将应用部署到 GitHub Pages，需要通过 GitHub Secrets 配置环境变量，而不是使用本地的 `.env.local` 文件：

### 1. 添加 GitHub Secrets

1. 访问你的 GitHub 仓库
2. 点击 **Settings**
3. 在左侧边栏中，点击 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加第一个 Secret：
   - **Name**: `VITE_CLOUDINARY_CLOUD_NAME`
   - **Value**: 你的 Cloudinary Cloud Name（例如：dxabc1234）
6. 点击 **Add secret**
7. 添加第二个 Secret：
   - **Name**: `VITE_CLOUDINARY_UPLOAD_PRESET`
   - **Value**: 你的 Cloudinary Upload Preset（例如：photo-gallery-unsigned）
8. 点击 **Add secret**

### 2. 触发重新部署

添加 Secrets 后，推送代码到 main 分支，GitHub Actions 将自动重新构建并部署应用，此时 Cloudinary 配置将正确加载！

---

## 功能特性

### 支持的文件格式

- JPEG / JPG
- PNG
- WebP
- GIF

### 文件限制

- 最大文件大小：10MB
- 最大文件数量：10个/批次
- 建议图片尺寸：不超过 4000x4000 像素

### 上传功能

- ✅ 拖拽上传
- ✅ 点击选择上传
- ✅ 多文件批量上传
- ✅ 实时进度显示
- ✅ 文件格式验证
- ✅ 文件大小验证
- ✅ 错误处理和提示

### 图片优化

上传后，Cloudinary 自动提供：
- 格式优化（自动转换为最佳格式）
- 压缩优化
- 多尺寸版本
- CDN 全球加速

---

## 在代码中使用

### 上传组件

```tsx
import { CloudinaryUpload } from "./components/CloudinaryUpload";

<CloudinaryUpload
  albumId="your-album-id"
  onUploadComplete={(results) => {
    console.log("Uploaded:", results);
    // results[0].secure_url - 图片访问URL
    // results[0].public_id - 图片唯一ID
  }}
  onUploadError={(error) => {
    console.error("Upload failed:", error);
  }}
  maxFiles={10}
/>
```

### 获取优化后的图片URL

```tsx
import { getOptimizedImageUrl } from "./utils/cloudinary";

// 获取指定尺寸的图片
const thumbnailUrl = getOptimizedImageUrl(publicId, 300, 300);
const fullSizeUrl = getOptimizedImageUrl(publicId, 1200);
```

---

## 故障排除

### 问题：配置错误提示

**症状**：页面上显示 "Cloudinary is not configured"

**解决方案**：
1. 检查 `.env.local` 文件是否存在
2. 确认环境变量名称正确（以 `VITE_` 开头）
3. 重启开发服务器

### 问题：上传失败

**症状**：上传进度卡住或显示错误

**解决方案**：
1. 检查网络连接
2. 确认文件大小不超过 10MB
3. 确认文件格式正确
4. 检查浏览器控制台错误信息

### 问题：跨域错误

**症状**：浏览器控制台显示 CORS 错误

**解决方案**：
1. 检查 Upload Preset 配置
2. 确认 Cloudinary 账户已激活
3. 清除浏览器缓存重试

---

## 安全最佳实践

1. **使用 Unsigned Upload Preset**
   - 适合客户端直接上传
   - 在 Cloudinary 控制台配置限制（文件夹、格式等）

2. **不要暴露 API Secret**
   - API Secret 只能在服务器端使用
   - 前端代码只使用 Cloud Name 和 Upload Preset

3. **设置上传限制**
   - 在 Upload Preset 中设置最大文件大小
   - 限制允许的文件格式
   - 使用文件夹组织图片

4. **定期备份**
   - Cloudinary 提供自动备份
   - 建议定期导出重要图片

---

## 免费额度说明

Cloudinary 免费账户包含：

- **存储空间**：25GB
- **转换操作**：7500次/月
- **带宽**：25GB/月
- **请求次数**：无限制

超出免费额度后：
- 图片仍然可以访问
- 新的上传和转换将被限制
- 可以升级到付费计划

---

## 升级选项

如果免费额度不足，可以考虑：

1. **Cloudinary Plus** ($25/月)
   - 225GB 存储
   - 75000 次转换

2. **自托管方案**
   - 使用 Supabase 或 Firebase
   - 参见 DEPLOYMENT_GUIDE.md

---

## 相关文档

- [Cloudinary 官方文档](https://cloudinary.com/documentation)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
- [Upload Preset 配置](https://cloudinary.com/documentation/upload_presets)

---

## 总结

完成以上步骤后，你的应用将具备：

- ✅ 安全可靠的云存储
- ✅ 全球 CDN 加速
- ✅ 自动图片优化
- ✅ 完整的上传管理界面
- ✅ 错误处理和进度显示

现在可以开始上传照片了！
