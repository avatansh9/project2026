from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from model_loader import load_model
from caption_generator import generate_captions

# ----------------------------
# Create FastAPI App
# ----------------------------

app = FastAPI()

# Enable CORS (important for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Load Model Once At Startup
# ----------------------------

try:
    processor, model = load_model()
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Failed to load model:", e)
    processor, model = None, None


# ----------------------------
# Root Test Route
# ----------------------------

@app.get("/")
def root():
    return {"message": "AI Caption Generator Backend Running 🚀"}


# ----------------------------
# Generate Caption Endpoint
# ----------------------------

@app.post("/generate")
async def generate_caption(
    file: UploadFile = File(...),
    tone: str = Form("casual")
):
    if processor is None or model is None:
        return {"error": "Model not loaded properly."}

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        captions = generate_captions(image, processor, model, tone)

        return {
            "status": "success",
            "captions": captions
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
