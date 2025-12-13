from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import pathlib
pathlib.PosixPath = pathlib.WindowsPath

app = FastAPI()

# 1. CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load your custom trained model
model_path = "model_weights/best.pt"
model = YOLO(model_path)

@app.post("/scan-fridge")
async def scan_fridge(file: UploadFile = File(...)):
    # Read the image file uploaded by the user
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # Run inference
    results = model(image)

    # Process results
    detected_items = []
    
    # YOLO returns a list of Result objects (one per image)
    for result in results:
        # Check the boxes (detections)
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])
            
            # Add to our list (you can filter by confidence here if needed)
            detected_items.append({
                "item": class_name,
                "confidence": round(confidence, 2)
            })

    # Return clean JSON to the frontend
    # Example: {"food_found": [{"item": "milk", "confidence": 0.92}, ...]}
    return {"food_found": detected_items}
