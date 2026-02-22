# Photo Gallery Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [Backend Solutions](#backend-solutions)
   - [Option 1: Supabase (Recommended)](#option-1-supabase-recommended)
   - [Option 2: Firebase](#option-2-firebase)
   - [Option 3: Self-Hosted (Node.js + PostgreSQL)](#option-3-self-hosted-nodejs--postgresql)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive instructions for deploying the Photo Gallery application and setting up a backend for secure photo storage.

### Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Deployment**: GitHub Pages (Static Hosting)
- **Backend Options**: Supabase, Firebase, or Self-Hosted

---

## Prerequisites

- Node.js v18 or higher
- npm or pnpm package manager
- Git
- GitHub account
- Backend service account (Supabase/Firebase) or VPS for self-hosting

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/jovanmei/photo.git
cd photo
npm install
```

### 2. Environment Configuration

Create `.env.local` file:

```env
# For Supabase backend
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OR for Firebase backend
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## GitHub Pages Deployment

### 1. Configure Vite

Ensure `vite.config.ts` has the correct base path:

```typescript
export default defineConfig({
  base: '/photo/', // Your repository name
  // ... other config
});
```

### 2. Build and Deploy

```bash
npm run build
npm run deploy
```

### 3. Configure GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / (root)
4. Click Save

### 4. GitHub Actions (Automated Deployment)

The repository includes `.github/workflows/deploy.yml` for automatic deployment on push to main.

---

## Backend Solutions

### Option 1: Supabase (Recommended)

**Why Supabase?**
- ✅ Open source (PostgreSQL-based)
- ✅ Generous free tier: 500MB storage, 2GB database
- ✅ Built-in authentication
- ✅ Row Level Security (RLS)
- ✅ Real-time subscriptions
- ✅ RESTful API auto-generated

#### Setup Instructions

**Step 1: Create Supabase Project**

1. Visit https://supabase.com
2. Sign up with GitHub
3. Create new project
4. Note your project URL and anon key

**Step 2: Database Schema**

Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Albums table
CREATE TABLE albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  display_title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Photos table
CREATE TABLE photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  location TEXT,
  description TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  storage_path TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policies for albums
CREATE POLICY "Allow public read access" ON albums
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create albums" ON albums
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow owners to update albums" ON albums
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow owners to delete albums" ON albums
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for photos
CREATE POLICY "Allow public read access" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to add photos" ON photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete photos" ON photos
  FOR DELETE USING (auth.role() = 'authenticated');
```

**Step 3: Install Supabase Client**

```bash
npm install @supabase/supabase-js
```

**Step 4: Create Supabase Client**

Create `src/utils/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload photo to Supabase Storage
export const uploadPhoto = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(data.path);

  return publicUrl;
};

// Fetch all albums with photos
export const fetchAlbums = async () => {
  const { data: albums, error } = await supabase
    .from('albums')
    .select(`
      *,
      photos (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return albums;
};

// Create new album
export const createAlbum = async (album: {
  title: string;
  displayTitle: string;
  description: string;
}) => {
  const { data, error } = await supabase
    .from('albums')
    .insert([album])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Add photo to album
export const addPhotoToAlbum = async (photo: {
  albumId: string;
  name: string;
  url: string;
  location?: string;
  storagePath: string;
}) => {
  const { data, error } = await supabase
    .from('photos')
    .insert([{
      album_id: photo.albumId,
      name: photo.name,
      url: photo.url,
      location: photo.location,
      storage_path: photo.storagePath
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete photo
export const deletePhoto = async (photoId: string, storagePath: string) => {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([storagePath]);

  if (storageError) throw storageError;

  // Delete from database
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
};

// Admin authentication
export const signInAdmin = async (password: string) => {
  // For simple admin access, you can use a service role key
  // or implement a custom auth flow
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@yourdomain.com',
    password: password
  });

  if (error) throw error;
  return data;
};
```

**Step 5: Configure Storage**

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `photos`
3. Set bucket to public
4. Configure CORS policies if needed

**Step 6: Update Frontend**

Replace localStorage-based album management with Supabase calls in your components.

---

### Option 2: Firebase

See existing documentation in this file (lines 163-384).

---

### Option 3: Self-Hosted (Node.js + PostgreSQL)

**Architecture:**
- Backend: Node.js + Express
- Database: PostgreSQL
- Storage: Local filesystem or MinIO (S3-compatible)
- Authentication: JWT

#### Backend Implementation

Create a new directory `backend/` with the following structure:

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── albumController.ts
│   │   ├── photoController.ts
│   │   └── authController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── upload.ts
│   ├── routes/
│   │   ├── albums.ts
│   │   ├── photos.ts
│   │   └── auth.ts
│   ├── models/
│   │   ├── Album.ts
│   │   └── Photo.ts
│   └── index.ts
├── uploads/
├── .env
├── package.json
└── tsconfig.json
```

**package.json:**

```json
{
  "name": "photo-gallery-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "multer": "^1.4.5-lts.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/pg": "^8.10.9",
    "@types/multer": "^1.4.11",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

**src/index.ts:**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import albumRoutes from './routes/albums';
import photoRoutes from './routes/photos';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**src/config/database.ts:**

```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'photo_gallery',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Initialize tables
export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS albums (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        display_title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS photos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        location VARCHAR(255),
        description TEXT,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        storage_path TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized');
  } finally {
    client.release();
  }
};
```

**src/middleware/auth.ts:**

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

**src/middleware/upload.ts:**

```typescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
```

**src/routes/photos.ts:**

```typescript
import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

// Get all photos
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT p.*, a.title as album_title 
      FROM photos p 
      JOIN albums a ON p.album_id = a.id
      ORDER BY p.upload_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Upload photo (admin only)
router.post('/', authenticate, requireAdmin, upload.single('photo'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { albumId, name, location } = req.body;
    const storagePath = req.file.filename;
    const url = `/uploads/${storagePath}`;

    const result = await pool.query(
      `INSERT INTO photos (album_id, name, url, location, storage_path)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [albumId, name, url, location, storagePath]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
});

// Delete photo (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    // Get photo info
    const photoResult = await pool.query(
      'SELECT storage_path FROM photos WHERE id = $1',
      [req.params.id]
    );

    if (photoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete file
    const filePath = path.join('uploads', photoResult.rows[0].storage_path);
    await fs.unlink(filePath).catch(() => {});

    // Delete from database
    await pool.query('DELETE FROM photos WHERE id = $1', [req.params.id]);

    res.json({ message: 'Photo deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
```

**src/middleware/errorHandler.ts:**

```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};
```

---

## API Documentation

### Authentication

#### POST /api/auth/login
Login as admin

**Request:**
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "username": "admin",
    "isAdmin": true
  }
}
```

### Albums

#### GET /api/albums
Get all albums with photos

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Wildlife Collection",
    "display_title": "wildlife",
    "description": "A curated collection...",
    "created_at": "2024-01-15T00:00:00Z",
    "photos": [
      {
        "id": "uuid",
        "name": "Panda Bamboo",
        "url": "https://...",
        "location": "Chengdu, China",
        "upload_date": "2024-01-15T00:00:00Z"
      }
    ]
  }
]
```

#### POST /api/albums
Create new album (Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "New Album",
  "displayTitle": "new-album",
  "description": "Album description"
}
```

### Photos

#### POST /api/photos
Upload photo (Admin only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: File (JPEG, PNG, WebP, max 10MB)
- `albumId`: UUID of album
- `name`: Photo name
- `location`: (optional) Location where photo was taken

**Response:**
```json
{
  "id": "uuid",
  "name": "Photo Name",
  "url": "/uploads/filename.jpg",
  "location": "Location",
  "upload_date": "2024-01-15T00:00:00Z"
}
```

#### DELETE /api/photos/:id
Delete photo (Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure backend CORS is configured with correct frontend URL
- Check that credentials are properly handled

**2. Upload Failures**
- Verify file size is under limit (10MB)
- Check file type (JPEG, PNG, WebP only)
- Ensure uploads directory exists and is writable

**3. Database Connection**
- Verify PostgreSQL is running
- Check connection credentials in .env
- Ensure database and tables are created

**4. JWT Authentication**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure Authorization header format: `Bearer <token>`

### Security Checklist

- [ ] JWT secret is strong and unique
- [ ] Passwords are hashed with bcrypt
- [ ] File uploads are validated
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are set
- [ ] CORS is restricted to known origins
- [ ] Database uses parameterized queries
- [ ] Admin routes are protected

---

## Production Deployment

### Using Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_NAME=photo_gallery
      - DB_USER=postgres
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - uploads:/app/uploads
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=photo_gallery
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  uploads:
  postgres_data:
```

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Deploy:
```bash
docker-compose up -d
```

---

## Summary

This deployment guide provides three backend options:

1. **Supabase** (Recommended): Easiest setup, generous free tier, PostgreSQL-based
2. **Firebase**: Good alternative, but vendor lock-in
3. **Self-Hosted**: Full control, requires server management

Choose based on your needs:
- Quick start → Supabase
- Google ecosystem → Firebase
- Full control → Self-hosted
