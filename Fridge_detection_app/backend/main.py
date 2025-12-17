from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import pathlib
import json

# Uncomment this line when runnning on Windows
# pathlib.PosixPath = pathlib.WindowsPath

app = FastAPI()

origins = [
    "http://localhost:3000",  # Browser origin
    "http://127.0.0.1:3000",  # Localhost alias
    "http://backend:8000"     # Internal Docker origin
]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model_path = "model_weights/best.pt"
model = YOLO(model_path)

@app.post("/scan-fridge")
async def scan_fridge(
    file: UploadFile = File(...),
    expected_items: str = Form(...)
):
    # Convert expected items from JSON string to Python list
    expected_items_list = json.loads(expected_items)
    expected_items_list = [item.lower() for item in expected_items_list]

    # Read image
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # Run YOLO
    results = model(image)

    detected_items = []
    detected_item_names = set()

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id].lower()
            confidence = float(box.conf[0])

            detected_items.append({
                "item": class_name,
                "confidence": round(confidence, 2)
            })

            detected_item_names.add(class_name)

    # Compute missing items
    missing_items = [
        item for item in expected_items_list
        if item not in detected_item_names
    ]

    return {
        "food_found": detected_items,
        "missing_food": missing_items
    }
