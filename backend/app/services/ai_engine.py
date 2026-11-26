import os
import re
import subprocess
import time
from pathlib import Path
from typing import Tuple, Optional, List
from PIL import Image
from app.core.config import settings

class AIEngineService:
    def __init__(self):
        self.engine_path = Path(settings.AI_ENGINE_PATH).resolve()
        self.models_path = Path(settings.AI_MODELS_PATH).resolve()
        self.gpu_id = settings.AI_GPU_ID

    def is_engine_available(self) -> bool:
        """Checks if realesrgan-ncnn-vulkan.exe exists and is executable."""
        return self.engine_path.exists() and self.engine_path.is_file()

    def get_available_models(self) -> List[str]:
        """Detects available model files in the models directory."""
        if not self.models_path.exists() or not self.models_path.is_dir():
            return []
        
        # Real-ESRGAN models consist of .param and .bin pairs
        param_files = {f.stem for f in self.models_path.glob("*.param")}
        bin_files = {f.stem for f in self.models_path.glob("*.bin")}
        valid_models = sorted(list(param_files.intersection(bin_files)))
        return valid_models

    @staticmethod
    def get_native_scale(model_name: str) -> int:
        """Returns the scale a model was trained for (e.g. 'realesrgan-x4plus' -> 4,
        'realesr-animevideov3-x2' -> 2). Running a model at any other scale makes the
        NCNN tiler misplace tiles, so we always run at the native scale."""
        match = re.search(r"-x(\d)", model_name)
        return int(match.group(1)) if match else 4

    def check_health(self) -> dict:
        """Detailed status of the AI engine and environment."""
        engine_exists = self.is_engine_available()
        models = self.get_available_models()
        
        return {
            "engine_available": engine_exists,
            "engine_path": str(self.engine_path),
            "models_available": models,
            "models_path": str(self.models_path),
            "configured_gpu": self.gpu_id
        }

    def enhance_image(
        self,
        input_path: Path,
        output_path: Path,
        scale: int = 4,
        model_name: str = "realesrgan-x4plus",
        output_format: str = "png",
        timeout_seconds: int = 300,
        min_height: Optional[int] = None
    ) -> Tuple[bool, Optional[str], int]:
        """
        Executes Real-ESRGAN NCNN Vulkan via subprocess with shell=False.
        Returns: (success, error_message, duration_ms)
        """
        if not self.is_engine_available():
            return (
                False,
                f"AI Engine executable not found at '{self.engine_path}'. Please verify the installation.",
                0
            )

        if not input_path.exists():
            return (False, f"Input image does not exist: {input_path}", 0)

        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Validate model existence
        available_models = self.get_available_models()
        if available_models and model_name not in available_models:
            # Fallback to first available model if requested is missing
            fallback = available_models[0]
            model_name = fallback

        # x4plus models only work correctly at 4x. If a different scale (or a minimum
        # output height) is requested, run the model at its native scale and resize
        # the result with Lanczos to the final target size.
        native_scale = self.get_native_scale(model_name)
        with Image.open(input_path) as src_img:
            src_w, src_h = src_img.size
        target_size = (src_w * scale, src_h * scale)
        if min_height and target_size[1] < min_height:
            # Keep aspect ratio while lifting the height to the required minimum
            target_size = (max(1, round(target_size[0] * min_height / target_size[1])), min_height)
        needs_resize = target_size != (src_w * native_scale, src_h * native_scale)
        engine_output_path = (
            output_path.with_name(f"{output_path.stem}_native{native_scale}x.png")
            if needs_resize else output_path
        )
        engine_format = "png" if needs_resize else output_format.lower()

        # Build clean command list (NO shell=True)
        cmd = [
            str(self.engine_path),
            "-i", str(input_path.resolve()),
            "-o", str(engine_output_path.resolve()),
            "-s", str(native_scale),
            "-n", model_name,
            "-m", str(self.models_path.resolve()),
            "-f", engine_format
        ]

        if self.gpu_id is not None:
            cmd.extend(["-g", str(self.gpu_id)])

        start_time = time.time()
        try:
            # Run without shell=True
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                check=False
            )
            
            duration_ms = int((time.time() - start_time) * 1000)

            if process.returncode != 0:
                err_msg = process.stderr.strip() or process.stdout.strip() or f"Process exited with code {process.returncode}"
                return False, f"Real-ESRGAN failed: {err_msg}", duration_ms

            if not engine_output_path.exists() or engine_output_path.stat().st_size == 0:
                return False, "AI engine finished but no output file was created or file is empty.", duration_ms

            if needs_resize:
                with Image.open(engine_output_path) as native_img:
                    resized = native_img.resize(target_size, Image.LANCZOS)
                    if output_format.lower() in ("jpg", "jpeg"):
                        resized.convert("RGB").save(output_path, "JPEG", quality=95)
                    else:
                        resized.save(output_path, "PNG")
                try:
                    engine_output_path.unlink()
                except OSError:
                    pass
                duration_ms = int((time.time() - start_time) * 1000)

            # Verify that output file is indeed a valid image
            with Image.open(output_path) as out_img:
                out_img.verify()

            return True, None, duration_ms

        except subprocess.TimeoutExpired:
            duration_ms = int((time.time() - start_time) * 1000)
            return False, f"AI processing timed out after {timeout_seconds} seconds.", duration_ms
        except Exception as e:
            duration_ms = int((time.time() - start_time) * 1000)
            return False, f"Subprocess execution error: {str(e)}", duration_ms

ai_engine_service = AIEngineService()
