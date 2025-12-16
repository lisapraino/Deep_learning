# 🧊 Fridge Detection App

A deep learning-powered web application that scans images of your fridge to automatically detect food ingredients. It uses a fine-tuned **YOLOv11** model to identify items and helps manage your inventory.


## 🛠️ Tech Stack

* **Backend:** Python, FastAPI, Ultralytics (YOLOv11), Pillow
* **Frontend:** React, TypeScript, Vite, Axios
* **Model:** Fine-tuned YOLOv11 (`best.pt`)

---

## 📦 Installation & Setup

### 1. Backend Setup (Python)
Navigate to server folder (where `main.py` is located).

1.  **Install Dependencies:**
    
    Automatically from requirements.txt (Recommended):
    ```bash
    pip install -r requirements.txt
    ```

    or manually:
    ```bash
    pip install fastapi uvicorn ultralytics python-multipart pillow
    ```

2.  **Run the Server:**
    ```bash
    uvicorn main:app --reload
    ```
    *The backend will start at `http://127.0.0.1:8000`*

### 2. Frontend Setup (React)

Navigate to frontend folder.

1.  **Install Node Modules:**
    ```bash
    npm install
    ```

2.  **Run the Application:**
    ```bash
    npm run dev
    ```
    *The frontend will start at `http://localhost:5173`.*


