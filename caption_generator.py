import torch
from config import DEVICE
from tone_engine import apply_tone

def generate_captions(image, processor, model, tone):

    inputs = processor(image, return_tensors="pt").to(DEVICE)

    torch.manual_seed(torch.randint(0, 100000, (1,)).item())

    outputs = model.generate(
        **inputs,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=1.3,
        repetition_penalty=1.3,
        max_length=40,
        num_return_sequences=3
    )

    captions = [
        processor.decode(output, skip_special_tokens=True)
        for output in outputs
    ]

    styled = [apply_tone(cap, tone) for cap in captions]

    return styled
