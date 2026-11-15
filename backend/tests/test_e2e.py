import time
import urllib.request
import urllib.parse
import json
import io
import zipfile
from pathlib import Path
from PIL import Image

BASE_URL = "http://127.0.0.1:8000"

def run_test():
    print("--- 1. Testing Health Endpoint ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/health")
    health = json.loads(req.read().decode())
    print("Health:", health)
    assert health["engine_available"] == True
    assert len(health["models_available"]) >= 2

    print("\n--- 2. Preparing Real Test Images ---")
    img_dir = Path("ai-engine")
    jpg_path = img_dir / "input.jpg"
    assert jpg_path.exists(), "input.jpg not found"

    # Also create a small test PNG image
    png_path = Path("backend/temp/sample_test.png")
    png_path.parent.mkdir(parents=True, exist_ok=True)
    sample_img = Image.new("RGB", (64, 64), color=(255, 80, 80))
    sample_img.save(png_path)
    print(f"Created sample PNG at {png_path} (64x64)")

    print("\n--- 3. Testing POST /api/upload (Multi-file) ---")
    boundary = "----WebKitFormBoundaryPixelBoost7MA4YWxkTrZu0gW"
    body = io.BytesIO()

    # Add jpg
    body.write(f"--{boundary}\r\n".encode())
    body.write(b'Content-Disposition: form-data; name="files"; filename="input.jpg"\r\n')
    body.write(b"Content-Type: image/jpeg\r\n\r\n")
    with open(jpg_path, "rb") as f:
        body.write(f.read())
    body.write(b"\r\n")

    # Add png
    body.write(f"--{boundary}\r\n".encode())
    body.write(b'Content-Disposition: form-data; name="files"; filename="sample_test.png"\r\n')
    body.write(b"Content-Type: image/png\r\n\r\n")
    with open(png_path, "rb") as f:
        body.write(f.read())
    body.write(b"\r\n")

    body.write(f"--{boundary}--\r\n".encode())

    req = urllib.request.Request(
        f"{BASE_URL}/api/upload",
        data=body.getvalue(),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    res = urllib.request.urlopen(req)
    uploaded = json.loads(res.read().decode())
    print(f"Uploaded {len(uploaded)} images successfully:")
    for u in uploaded:
        print(f" - ID: {u['id']}, Name: {u['original_name']}, Dimensions: {u['width']}x{u['height']}, Size: {u['file_size']} bytes")
    
    assert len(uploaded) == 2
    img1_id = uploaded[0]["id"]
    img2_id = uploaded[1]["id"]

    print("\n--- 4. Testing POST /api/enhance (Start Real AI Upscaling) ---")
    enhance_payload = json.dumps({
        "image_ids": [img1_id, img2_id],
        "scale": 4,
        "model_name": "realesrgan-x4plus",
        "output_format": "png",
        "face_enhance": False
    }).encode()

    req = urllib.request.Request(
        f"{BASE_URL}/api/enhance",
        data=enhance_payload,
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    job = json.loads(res.read().decode())
    job_id = job["job_id"]
    print(f"Job created! ID: {job_id}, Initial Status: {job['status']}")

    print("\n--- 5. Polling GET /api/jobs/{job_id} until completed ---")
    max_wait = 120
    start = time.time()
    while time.time() - start < max_wait:
        req = urllib.request.urlopen(f"{BASE_URL}/api/jobs/{job_id}")
        current_job = json.loads(req.read().decode())
        print(f"Progress: {current_job['progress_percent']}% | Status: {current_job['status']} | Completed: {current_job['completed_images']}/{current_job['total_images']}")
        if current_job["status"] in ["completed", "failed"]:
            break
        time.sleep(1)

    assert current_job["status"] == "completed", f"Job failed: {current_job.get('error')}"
    print("AI Upscaling Job completed successfully!")

    print("\n--- 6. Inspecting Results /api/jobs/{job_id}/results ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/jobs/{job_id}/results")
    results = json.loads(req.read().decode())
    for r in results:
        print(f"Image {r['original_name']}:")
        print(f"  Status: {r['status']}")
        print(f"  Original: {r['original_width']}x{r['original_height']} ({r['original_size']} B)")
        print(f"  Enhanced: {r['enhanced_width']}x{r['enhanced_height']} ({r['enhanced_size']} B)")
        print(f"  Time: {r['processing_time_ms']} ms")
        assert r["status"] == "completed"
        assert r["enhanced_width"] == r["original_width"] * 4
        assert r["enhanced_height"] == r["original_height"] * 4

    print("\n--- 7. Testing GET /api/download/{image_id} ---")
    result_id = results[0]["id"]
    req = urllib.request.urlopen(f"{BASE_URL}/api/download/{result_id}")
    downloaded_data = req.read()
    print(f"Downloaded enhanced image: {len(downloaded_data)} bytes")
    with Image.open(io.BytesIO(downloaded_data)) as downloaded_img:
        downloaded_img.verify()
    print("Enhanced image verified valid via PIL!")

    print("\n--- 8. Testing GET /api/download-zip/{job_id} ---")
    req = urllib.request.urlopen(f"{BASE_URL}/api/download-zip/{job_id}")
    zip_bytes = req.read()
    print(f"Downloaded ZIP archive: {len(zip_bytes)} bytes")
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        namelist = zf.namelist()
        print("ZIP contents:", namelist)
        assert len(namelist) == 2

    print("\n--- 9. Testing DELETE /api/jobs/{job_id} ---")
    req = urllib.request.Request(f"{BASE_URL}/api/jobs/{job_id}", method="DELETE")
    res = urllib.request.urlopen(req)
    del_resp = json.loads(res.read().decode())
    print("Delete response:", del_resp)

    print("\n==========================================")
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
    print("==========================================")

if __name__ == "__main__":
    run_test()
