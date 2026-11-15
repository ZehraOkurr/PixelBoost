# PixelBoost AI — Real AI-Powered Super Resolution Web App

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_%2B_Vite-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Real-ESRGAN](https://img.shields.io/badge/AI_Engine-Real--ESRGAN_Vulkan-FF4F00?style=flat-square)](https://github.com/xinntao/Real-ESRGAN)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**PixelBoost AI** is a production-grade, locally runnable AI super-resolution and image enhancement web application. It reconstructs and sharpens low-resolution photos, digital illustrations, and anime artworks using **official Real-ESRGAN NCNN Vulkan** neural networks with local hardware acceleration (NVIDIA GPU / Vulkan compute).

---

## Key Features

- **Real AI Upscaling**: Powered by the official pre-trained Real-ESRGAN models (`realesrgan-x4plus`, `realesrgan-x4plus-anime`, `realesr-animevideov3-x2`). **No mock or simulated AI processing.**
- **Hardware-Accelerated (Vulkan)**: Uses local GPU compute (e.g., NVIDIA GeForce RTX 4050) without relying on expensive, privacy-invasive cloud APIs.
- **2x & 4x Scaling**: Flexible upscaling factors for quick enhancement or maximum Ultra HD sharpness.
- **Batch Processing**: Upload up to 20 images simultaneously; the backend queues and processes images sequentially to avoid VRAM exhaustion.
- **Interactive Comparison Slider**: Side-by-side before/after split slider allowing horizontal wiping to inspect fine reconstructed details.
- **Batch ZIP Export**: Single-click archive download containing all successfully enhanced images with formatted filenames.
- **Security & Integrity**: Magic-byte inspection via Pillow, strict mime type and size validation, UUID file naming, and path-traversal prevention.
- **Bilingual Interface**: Turkish by default with instant toggle to English.
- **Modern SaaS Dashboard**: Sleek light/white aesthetic, dark navy typography, crimson accent colors, and subtle micro-animations.

---

## Architecture & Project Structure

```
PixelBoost/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Dropzone, ImageQueue, ComparisonSlider, etc.
│   │   ├── pages/                # Dashboard, Enhancer, History, Settings
│   │   ├── services/             # API client
│   │   ├── i18n/                 # Turkish & English translations
│   │   └── types/                # TypeScript interface definitions
│   └── vite.config.ts            # Dev server with /api proxy
├── backend/                      # Python 3.13 / FastAPI Backend
│   ├── app/
│   │   ├── api/                  # /api/health, /upload, /enhance, /download
│   │   ├── core/                 # Config & Security validation
│   │   ├── models/               # Pydantic request/response schemas
│   │   └── services/             # AI engine subprocess, Job manager, File service
│   ├── uploads/                  # Temporary validated uploads
│   ├── outputs/                  # Finished batch archives
│   ├── temp/                     # Unique per-job working directories
│   └── requirements.txt
├── ai-engine/                    # Portable Real-ESRGAN NCNN Vulkan distribution
│   ├── realesrgan-ncnn-vulkan.exe
│   └── models/                   # Official .bin and .param model pairs
├── .env.example                  # Environment configuration template
├── .gitignore
└── README.md
```

---

## Prerequisites

1. **Python 3.11+** (Tested on Python 3.13)
2. **Node.js 18+** & **npm** (Tested on Node v22.20)
3. **Vulkan-capable GPU** (NVIDIA, AMD, or Intel modern graphics driver)

---

## Quick Start (Installation & Execution)

### 1. Backend Setup

```bash
# In the repository root:
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment:
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Windows (CMD):
.\.venv\Scripts\activate.bat

# Install dependencies:
pip install -r requirements.txt

# Start the FastAPI server on port 8000:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API will be available at `http://127.0.0.1:8000` (Interactive Swagger docs: `http://127.0.0.1:8000/docs`).

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend

# Install packages
npm install

# Run Vite development server
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

## AI Engine Configuration

The backend is configured via `.env` (or environment variables):

```ini
# AI Engine executable path
AI_ENGINE_PATH=ai-engine/realesrgan-ncnn-vulkan.exe

# Models folder containing .bin and .param files
AI_MODELS_PATH=ai-engine/models

# GPU Device ID (0 = first GPU, 1 = second/dedicated GPU, -1 = CPU)
AI_GPU_ID=1

# Upload & Job Limits
UPLOAD_MAX_SIZE_MB=50
MAX_BATCH_SIZE=20
JOB_TIMEOUT_SECONDS=600
AUTO_CLEANUP_HOURS=24
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check engine availability, model list, GPU device, and status |
| `POST` | `/api/upload` | Upload multiple images (validated via PIL header verification) |
| `GET` | `/api/preview/{image_id}` | Preview uploaded original image |
| `POST` | `/api/enhance` | Start async sequential enhancement job (`scale`, `model_name`, etc.) |
| `GET` | `/api/jobs/{job_id}` | Poll real-time job progress (percent, completed/failed count) |
| `GET` | `/api/jobs/{job_id}/results`| Retrieve before/after dimensions, sizes, and file URLs |
| `GET` | `/api/download/{image_id}` | Download an individual upscaled image |
| `GET` | `/api/download-zip/{job_id}`| Download all successfully upscaled batch images in a ZIP archive |
| `DELETE`| `/api/jobs/{job_id}` | Delete temporary files and job cache |

---

## Automated End-to-End Testing

You can run the full automated test suite verifying uploads, real GPU AI upscaling, dimension accuracy, and ZIP extraction:

```bash
.\backend\.venv\Scripts\python.exe backend/tests/test_e2e.py
```

---

## Security & Privacy

- **100% Offline Processing**: Images never leave your local machine.
- **Sanitized Filenames & UUIDs**: Eliminates directory traversal vectors.
- **Deep File Verification**: Pillow `.verify()` checks actual image binary structure, not just file extensions.
- **No `shell=True`**: All subprocess invocations pass explicit arguments directly to the Windows API.

---

## License

MIT License. Real-ESRGAN and NCNN are licensed under BSD 3-Clause and Apache 2.0 respectively.
