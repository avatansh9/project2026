import torch

MODEL_NAME = "Salesforce/blip-image-captioning-base"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
