from model_loader import load_model
from caption_generator import generate_captions
from utils import load_image
from config import DEVICE
import os


def choose_tone():
    print("\nChoose tone:")
    print("1 - Casual")
    print("2 - Professional")
    print("3 - Promotional")
    print("4 - Friendly")
    print("5 - Informative")

    tone_map = {
        "1": "casual",
        "2": "professional",
        "3": "promotional",
        "4": "friendly",
        "5": "informative"
    }

    choice = input("Enter number (1-5): ").strip()
    return tone_map.get(choice)


def main():
    print("Using device:", DEVICE)

    # Load model
    try:
        processor, model = load_model()
        print("Model loaded successfully.\n")
    except Exception as e:
        print("❌ Failed to load model:", e)
        return

    # Get image path
    image_path = input("Enter image path: ").strip()

    if not image_path:
        print("❌ No image path provided. Please enter a valid filename.")
        return

    if not os.path.exists(image_path):
        print(f"❌ File '{image_path}' not found.")
        print("Make sure the image exists in this folder or provide full path.")
        return

    try:
        image = load_image(image_path)
    except Exception as e:
        print("❌ Error loading image:", e)
        return

    # Tone selection
    tone = choose_tone()

    if tone is None:
        print("❌ Invalid tone selection.")
        return

    # Generate captions
    try:
        captions = generate_captions(image, processor, model, tone)
    except Exception as e:
        print("❌ Error generating captions:", e)
        return

    print("\nGenerated Captions:\n")
    for i, cap in enumerate(captions, 1):
        print(f"{i}. {cap}\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nProgram stopped by user.")
