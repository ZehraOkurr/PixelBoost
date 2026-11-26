<p align="center">
  <img src="frontend/public/logo.png" alt="PixelBoost AI" width="120" />
</p>

<h1 align="center">PixelBoost AI</h1>

<p align="center">
  Real-ESRGAN ile yerel GPU üzerinde çalışan yapay zekâ destekli görsel büyütme (süper çözünürlük) uygulaması.
</p>

---

## Özellikler

- **Gerçek AI büyütme:** Resmi `realesrgan-x4plus` modeli ile 2x ve 4x büyütme.
- **Yerel çalışma:** Görseller hiçbir bulut servisine gönderilmez; işlem bilgisayarınızın GPU'sunda (Vulkan) yapılır.
- **Minimum yükseklik:** Çıktının yüksekliği belirlenen değerden (varsayılan 768 px) küçükse, en-boy oranı korunarak bu yüksekliğe çıkarılır. Ayar arayüzden açılıp kapatılabilir ve değiştirilebilir.
- **Toplu işlem:** Tek seferde 20 görsele kadar yükleme. Görseller GPU belleğini doldurmamak için sırayla işlenir.
- **Önce / sonra karşılaştırma:** Kaydırmalı karşılaştırma ile detay farkını inceleme.
- **ZIP indirme:** Bir işteki tüm sonuçları tek arşiv olarak indirme.
- **Güvenli yükleme:** Dosya içeriği Pillow ile doğrulanır, dosyalar UUID ile adlandırılır, dizin dışına çıkma (path traversal) engellenir.
- **İki dil:** Türkçe (varsayılan) ve İngilizce arayüz.

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, lucide-react |
| Backend | Python, FastAPI, Uvicorn, Pydantic, Pillow |
| AI motoru | [Real-ESRGAN ncnn Vulkan](https://github.com/xinntao/Real-ESRGAN) (`realesrgan-ncnn-vulkan.exe`) |

## Proje Yapısı

```
PixelBoost/
├── frontend/                 # React + TypeScript arayüz
│   ├── public/               # Logo ve favicon
│   └── src/
│       ├── components/       # Dropzone, ayarlar paneli, karşılaştırma kaydırıcısı vb.
│       ├── pages/            # Görsel İyileştirici, İşlem Geçmişi, Ayarlar
│       ├── services/api.ts   # Backend istemcisi
│       ├── i18n/             # Türkçe / İngilizce metinler
│       └── types/            # TypeScript tipleri
├── backend/                  # FastAPI sunucusu
│   ├── app/
│   │   ├── api/              # health, upload, enhance, download uç noktaları
│   │   ├── core/             # Ayarlar ve güvenlik kontrolleri
│   │   ├── models/           # Pydantic şemaları
│   │   └── services/         # AI motoru, iş kuyruğu, dosya işlemleri
│   ├── tests/test_e2e.py     # Uçtan uca test
│   └── requirements.txt
├── ai-engine/                # Real-ESRGAN programı ve modelleri (repoda yok, aşağıya bakın)
├── start.bat / start.ps1     # Backend ve frontend'i birlikte başlatır
└── .env.example
```

## Gereksinimler

- Windows 10/11
- Vulkan destekli bir ekran kartı (NVIDIA, AMD veya Intel)
- Python 3.11 veya üzeri (3.13 ile test edildi)
- Node.js 20.19+ veya 22+

## Kurulum

### 1. Projeyi indirin

```bash
git clone https://github.com/ZehraOkurr/PixelBoost.git
cd PixelBoost
```

### 2. AI motorunu ekleyin

AI motoru ve model dosyaları boyutları nedeniyle repoya dahil değildir.

1. [Real-ESRGAN Releases](https://github.com/xinntao/Real-ESRGAN/releases) sayfasından `realesrgan-ncnn-vulkan-...-windows.zip` dosyasını indirin.
2. Zip içeriğini `ai-engine/` klasörüne çıkarın. Sonuç şöyle görünmelidir:

```
ai-engine/
├── realesrgan-ncnn-vulkan.exe
├── vcomp140.dll
└── models/
    ├── realesrgan-x4plus.bin
    └── realesrgan-x4plus.param
```

### 3. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Frontend

```bash
cd frontend
npm install
```

## Çalıştırma

Proje kök klasöründe `start.bat` dosyasını çalıştırın. Backend ve frontend ayrı pencerelerde açılır, tarayıcı otomatik olarak uygulamayı açar.

Elle başlatmak isterseniz:

```bash
# 1. terminal
cd backend
.venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 2. terminal
cd frontend
npm run dev
```

| Adres | Açıklama |
|---|---|
| http://127.0.0.1:5173 | Uygulama arayüzü |
| http://127.0.0.1:8000/docs | API dokümantasyonu (Swagger) |

## Ayarlar

Sunucu ayarları `backend/app/core/config.py` dosyasındadır:

| Ayar | Varsayılan | Açıklama |
|---|---|---|
| `AI_GPU_ID` | `1` | Kullanılacak ekran kartının numarası |
| `UPLOAD_MAX_SIZE_MB` | `50` | Dosya başına en büyük boyut |
| `MAX_BATCH_SIZE` | `20` | Tek seferde yüklenebilecek görsel sayısı |
| `JOB_TIMEOUT_SECONDS` | `600` | Bir görsel için en uzun işlem süresi |

Desteklenen formatlar: JPG, JPEG, PNG, WEBP. Çıktılar PNG olarak kaydedilir.

## API

| Yöntem | Uç nokta | Açıklama |
|---|---|---|
| GET | `/api/health` | AI motoru ve model durumu |
| POST | `/api/upload` | Görsel yükleme (çoklu dosya) |
| GET | `/api/preview/{image_id}` | Yüklenen görselin önizlemesi |
| POST | `/api/enhance` | Büyütme işini başlatır |
| GET | `/api/jobs/{job_id}` | İş durumu ve ilerleme |
| GET | `/api/jobs/{job_id}/results` | İşin sonuçları |
| DELETE | `/api/jobs/{job_id}` | İşi ve geçici dosyalarını siler |
| GET | `/api/download/{image_id}` | Büyütülmüş görseli indirir |
| GET | `/api/download-zip/{job_id}` | Tüm sonuçları ZIP olarak indirir |

## Teknik Not: 2x Büyütme

`realesrgan-x4plus` modeli yalnızca 4x için eğitilmiştir ve doğrudan 2x çalıştırıldığında görüntü parçaları kayar. Bu yüzden 2x seçildiğinde model 4x çalıştırılır, sonuç Lanczos yöntemiyle 2x boyuta indirilir. Minimum yükseklik ayarı da aynı adımda uygulanır.

## Test

Backend çalışırken, proje kök klasöründen:

```bash
python backend/tests/test_e2e.py
```

Test `ai-engine/input.jpg` dosyasını kullanır.

## Teşekkür

Görsel büyütme [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) (Xintao Wang ve ark.) projesine dayanır.
