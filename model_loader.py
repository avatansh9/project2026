from transformers import BlipProcessor, BlipForConditionalGeneration
from config import MODEL_NAME, DEVICE

def load_model():
    processor = BlipProcessor.from_pretrained(MODEL_NAME)
    model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME).to(DEVICE)
    return processor, model
