export const translations = {
  tr: {
    // Nav
    nav_enhancer: "Görsel İyileştirici",
    nav_history: "İşlem Geçmişi",
    nav_settings: "Ayarlar",

    // Header & Meta
    app_subtitle: "Gerçek AI Destekli Süper Çözünürlük",

    // Dashboard
    dash_quick_action: "Hızlı İyileştirme Başlat",

    // Dropzone
    drop_title: "Görsellerinizi buraya sürükleyip bırakın",
    drop_subtitle: "veya bilgisayarınızdan dosya seçin",
    drop_btn_browse: "Dosyaları Seç",
    drop_batch_limit: "Tek seferde en fazla 20 görsel seçebilirsiniz.",
    drop_uploading: "Görseller yükleniyor ve doğrulanıyor...",

    // Image Queue
    queue_title: "Yüklenen Görseller",
    queue_count: "görsel hazır",
    queue_clear_all: "Tümünü Temizle",
    queue_remove: "Kaldır",

    // Settings Panel
    settings_title: "İyileştirme Seçenekleri",
    scale_label: "Büyütme Oranı",
    scale_2x_desc: "Hızlı işleme ve dengeli çözünürlük",
    scale_4x_desc: "Maksimum detay ve netlik",
    model_label: "Yapay Zeka Modeli",
    model_general: "RealESRGAN x4plus (Genel Fotoğraf)",
    model_general_desc: "Gerçek dünya fotoğrafları, portreler ve manzara",
    min_height_label: "Minimum Yükseklik",
    min_height_desc: "Çıktının yüksekliği bu değerden küçükse, en-boy oranı korunarak bu yüksekliğe büyütülür.",
    start_enhancement_btn: "Görselleri İyileştir",
    processing_btn: "AI İşleniyor...",

    // Processing & Results
    processing_title: "Yapay Zeka İşlemi Sürüyor",
    processing_subtitle: "Görseller GPU bellek güvenliği için sırayla işleniyor...",
    completed_title: "İyileştirme Tamamlandı!",
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

    // Engine Missing Banner
    banner_engine_title: "Real-ESRGAN AI Motoru Bulunamadı",
    banner_engine_desc: "AI motoru henüz yapılandırılmamış veya eksik. Gerçek yapay zeka yükseltmesi yapabilmek için 'realesrgan-ncnn-vulkan.exe' ve model dosyalarının ai-engine klasöründe bulunması gerekmektedir.",

    // History Page
    history_title: "İşlem Geçmişi",
    history_empty: "Bu oturumda henüz bir işlem yapılmadı.",

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
    nav_enhancer: "Image Enhancer",
    nav_history: "Processing History",
    nav_settings: "Settings",

    // Header & Meta
    app_subtitle: "Real AI-Powered Super Resolution",

    // Dashboard
    dash_quick_action: "Launch Enhancer",

    // Dropzone
    drop_title: "Drag and drop your images here",
    drop_subtitle: "or choose files from your computer",
    drop_btn_browse: "Browse Files",
    drop_batch_limit: "You can select up to 20 images at once.",
    drop_uploading: "Uploading and validating images...",

    // Image Queue
    queue_title: "Uploaded Images",
    queue_count: "images queued",
    queue_clear_all: "Clear All",
    queue_remove: "Remove",

    // Settings Panel
    settings_title: "Enhancement Settings",
    scale_label: "Upscale Factor",
    scale_2x_desc: "Fast processing and balanced resolution",
    scale_4x_desc: "Maximum detail and sharpness",
    model_label: "AI Neural Model",
    model_general: "RealESRGAN x4plus (General Photo)",
    model_general_desc: "Real-world photography, portraits, landscapes",
    min_height_label: "Minimum Height",
    min_height_desc: "If the output is shorter than this, it is enlarged to this height while keeping the aspect ratio.",
    start_enhancement_btn: "Enhance Images",
    processing_btn: "AI Processing...",

    // Processing & Results
    processing_title: "AI Upscaling in Progress",
    processing_subtitle: "Images are processed sequentially to ensure GPU memory stability...",
    completed_title: "Enhancement Completed!",
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

    // Engine Missing Banner
    banner_engine_title: "Real-ESRGAN AI Engine Not Found",
    banner_engine_desc: "The AI engine is not detected yet. To perform real AI upscaling, 'realesrgan-ncnn-vulkan.exe' and model files must be placed in the ai-engine folder.",

    // History Page
    history_title: "Processing History",
    history_empty: "No jobs have been run in this session yet.",

    // Settings Page
    config_title: "System & AI Configuration",
    config_engine_path: "AI Engine Executable Path",
    config_models_path: "Models Directory",
    config_active_gpu: "Active Graphics Device (GPU)",
    config_language: "Interface Language",
    config_save: "Verify Configuration"
  }
};
