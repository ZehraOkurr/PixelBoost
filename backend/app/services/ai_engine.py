import os
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
        timeout_seconds: int = 300
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

        # Build clean command list (NO shell=True)
        cmd = [
            str(self.engine_path),
            "-i", str(input_path.resolve()),
            "-o", str(output_path.resolve()),
            "-s", str(scale),
            "-n", model_name,
            "-m", str(self.models_path.resolve()),
            "-f", output_format.lower()
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

            if not output_path.exists() or output_path.stat().st_size == 0:
                return False, "AI engine finished but no output file was created or file is empty.", duration_ms

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
