export const translations = {
  tr: {
    // Nav
    nav_dashboard: "Kontrol Paneli",
    nav_enhancer: "Görsel İyileştirici",
    nav_history: "İşlem Geçmişi",
    nav_settings: "Ayarlar",

    // Header & Meta
    app_name: "PixelBoost AI",
    app_subtitle: "Gerçek AI Destekli Süper Çözünürlük",
    gpu_status: "Vulkan GPU Hızlandırma",
    status_ready: "Motor Hazır",
    status_engine_missing: "AI Motoru Eksik",

    // Dashboard
    dash_welcome_title: "PixelBoost AI'ya Hoş Geldiniz",
    dash_welcome_subtitle: "Fotoğraflarınızı ve illüstrasyonlarınızı Real-ESRGAN yapay zeka modelleriyle kaliteden ödün vermeden 2x ve 4x büyütün.",
    dash_stat_upscaled: "İyileştirilen Görseller",
    dash_stat_models: "Yüklü Modeller",
    dash_stat_engine: "AI Çekirdeği",
    dash_stat_gpu: "Grafik Birimi",
    dash_quick_action: "Hızlı İyileştirme Başlat",

    // Dropzone
    drop_title: "Görsellerinizi buraya sürükleyip bırakın",
    drop_subtitle: "veya bilgisayarınızdan dosya seçin",
    drop_btn_browse: "Dosyaları Seç",
    drop_formats: "Desteklenen formatlar: JPG, JPEG, PNG, WEBP (Maks. 50MB / dosya)",
    drop_batch_limit: "Tek seferde en fazla 20 görsel seçebilirsiniz.",
    drop_uploading: "Görseller yükleniyor ve doğrulanıyor...",

    // Image Queue
    queue_title: "Yüklenen Görseller",
    queue_count: "görsel hazır",
    queue_clear_all: "Tümünü Temizle",
    queue_remove: "Kaldır",
    queue_dimensions: "Boyut",
    queue_size: "Dosya Boyutu",

    // Settings Panel
    settings_title: "İyileştirme Seçenekleri",
    scale_label: "Büyütme Oranı",
    scale_2x: "2x Büyütme",
    scale_2x_desc: "Hızlı işleme ve dengeli çözünürlük",
    scale_4x: "4x Büyütme (Ultra HD)",
    scale_4x_desc: "Maksimum detay ve netlik",
    model_label: "Yapay Zeka Modeli",
    model_general: "RealESRGAN x4plus (Genel Fotoğraf)",
    model_general_desc: "Gerçek dünya fotoğrafları, portreler ve manzara",
    model_anime: "RealESRGAN Anime (Çizim & İllüstrasyon)",
    model_anime_desc: "Anime, dijital çizim, manga ve vektörel görseller",
    format_label: "Çıktı Formatı",
    face_enhance: "Yüz Netleştirme (GFPGAN)",
    face_enhance_desc: "Yüz detaylarını akıllı rekonstrüksiyon ile netleştir",
    start_enhancement_btn: "Görselleri İyileştir",
    processing_btn: "AI İşleniyor...",

    // AI Disclaimer
    ai_disclaimer_title: "Yapay Zeka Rekonstrüksiyon Bilgilendirmesi",
    ai_disclaimer_text: "PixelBoost AI, görüntüyü büyütürken eksik pikselleri orijinal piksel verisini kurtarmak yerine derin öğrenme ile yeniden yapılandırır (reconstruct). İnce detaylar gerçeğe uygun şekilde yapay zeka tarafından çizilir.",

    // Processing & Results
    processing_title: "Yapay Zeka İşlemi Sürüyor",
    processing_subtitle: "Görseller GPU bellek güvenliği için sırayla işleniyor...",
    completed_title: "İyileştirme Tamamlandı!",
    completed_subtitle: "Tüm görseller Real-ESRGAN ile başarıyla yükseltildi.",
    results_title: "Sonuçlar ve Karşılaştırma",
    btn_download_zip: "Tümünü ZIP Olarak İndir",
    btn_new_batch: "Yeni Parti Başlat",
    btn_process_more: "Daha Fazla Görsel Ekle",
    btn_download_image: "Görseli İndir",
    compare_original: "Orijinal",
    compare_enhanced: "PixelBoost AI",
    comparison_slider_hint: "Detay farkını görmek için ayırıcıyı kaydırın",

    // Details Modal
    details_orig_dim: "Orijinal Çözünürlük",
    details_enh_dim: "Yeni Çözünürlük",
    details_orig_size: "Orijinal Boyut",
    details_enh_size: "Yeni Boyut",
    details_time: "İşlem Süresi",

    // Engine Missing Banner
    banner_engine_title: "Real-ESRGAN AI Motoru Bulunamadı",
    banner_engine_desc: "AI motoru henüz yapılandırılmamış veya eksik. Gerçek yapay zeka yükseltmesi yapabilmek için 'realesrgan-ncnn-vulkan.exe' ve model dosyalarının ai-engine klasöründe bulunması gerekmektedir.",
    banner_setup_guide: "Kurulum Rehberi",

    // History Page
    history_title: "İşlem Geçmişi",
    history_empty: "Bu oturumda henüz bir işlem yapılmadı.",
    history_job_id: "İşlem No",
    history_status: "Durum",
    history_actions: "İşlemler",

    // Settings Page
    config_title: "Sistem ve AI Ayarları",
    config_engine_path: "AI Motor Dosya Yolu",
    config_models_path: "Modeller Klasörü",
    config_active_gpu: "Aktif Grafik Birimi (GPU)",
    config_language: "Arayüz Dili",
    config_save: "Ayarları Doğrula"
  },
  en: {
    // Nav
    nav_dashboard: "Dashboard",
    nav_enhancer: "Image Enhancer",
    nav_history: "Processing History",
    nav_settings: "Settings",

    // Header & Meta
    app_name: "PixelBoost AI",
    app_subtitle: "Real AI-Powered Super Resolution",
    gpu_status: "Vulkan GPU Acceleration",
    status_ready: "Engine Ready",
    status_engine_missing: "AI Engine Missing",

    // Dashboard
    dash_welcome_title: "Welcome to PixelBoost AI",
    dash_welcome_subtitle: "Upscale and restore your photos and illustrations 2x and 4x without losing quality using official Real-ESRGAN neural networks.",
    dash_stat_upscaled: "Upscaled Images",
    dash_stat_models: "Installed Models",
    dash_stat_engine: "AI Backend",
    dash_stat_gpu: "Graphics Unit",
    dash_quick_action: "Launch Enhancer",

    // Dropzone
    drop_title: "Drag and drop your images here",
    drop_subtitle: "or choose files from your computer",
    drop_btn_browse: "Browse Files",
    drop_formats: "Supported formats: JPG, JPEG, PNG, WEBP (Max 50MB per file)",
    drop_batch_limit: "You can select up to 20 images at once.",
    drop_uploading: "Uploading and validating images...",

    // Image Queue
    queue_title: "Uploaded Images",
    queue_count: "images queued",
    queue_clear_all: "Clear All",
    queue_remove: "Remove",
    queue_dimensions: "Dimensions",
    queue_size: "File Size",

    // Settings Panel
    settings_title: "Enhancement Settings",
    scale_label: "Upscale Factor",
    scale_2x: "2x Upscale",
    scale_2x_desc: "Fast processing and balanced resolution",
    scale_4x: "4x Upscale (Ultra HD)",
    scale_4x_desc: "Maximum detail and sharpness",
    model_label: "AI Neural Model",
    model_general: "RealESRGAN x4plus (General Photo)",
    model_general_desc: "Real-world photography, portraits, landscapes",
    model_anime: "RealESRGAN Anime (Art & Illustration)",
    model_anime_desc: "Anime, digital drawings, manga, vector art",
    format_label: "Output Format",
    face_enhance: "Face Enhancement (GFPGAN)",
    face_enhance_desc: "Reconstruct facial features with neural clarity",
    start_enhancement_btn: "Enhance Images",
    processing_btn: "AI Processing...",

    // AI Disclaimer
    ai_disclaimer_title: "AI Reconstruction Notice",
    ai_disclaimer_text: "PixelBoost AI reconstructs missing pixels using deep neural networks rather than recovering original raw sensor data. Fine details are synthesized to match natural image characteristics.",

    // Processing & Results
    processing_title: "AI Upscaling in Progress",
    processing_subtitle: "Images are processed sequentially to ensure GPU memory stability...",
    completed_title: "Enhancement Completed!",
    completed_subtitle: "All images were successfully upscaled with Real-ESRGAN.",
    results_title: "Results & Inspection",
    btn_download_zip: "Download All as ZIP",
    btn_new_batch: "Start New Batch",
    btn_process_more: "Add More Images",
    btn_download_image: "Download Image",
    compare_original: "Original",
    compare_enhanced: "PixelBoost AI",
    comparison_slider_hint: "Drag the divider to inspect enhanced details",

    // Details Modal
    details_orig_dim: "Original Dimensions",
    details_enh_dim: "New Dimensions",
    details_orig_size: "Original Size",
    details_enh_size: "Enhanced Size",
    details_time: "Processing Time",

    // Engine Missing Banner
    banner_engine_title: "Real-ESRGAN AI Engine Not Found",
    banner_engine_desc: "The AI engine is not detected yet. To perform real AI upscaling, 'realesrgan-ncnn-vulkan.exe' and model files must be placed in the ai-engine folder.",
    banner_setup_guide: "Setup Guide",

    // History Page
    history_title: "Processing History",
    history_empty: "No jobs have been run in this session yet.",
    history_job_id: "Job ID",
    history_status: "Status",
    history_actions: "Actions",

    // Settings Page
    config_title: "System & AI Configuration",
    config_engine_path: "AI Engine Executable Path",
    config_models_path: "Models Directory",
    config_active_gpu: "Active Graphics Device (GPU)",
    config_language: "Interface Language",
    config_save: "Verify Configuration"
  }
};
