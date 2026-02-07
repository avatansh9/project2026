import random
from hashtag_engine import get_relevant_hashtags

EMOJI_POOL = [
    "📸","✨","🔥","😊","🌟","🚀","💫","🎯",
    "💥","⚡","🎉","🥳","😎","🤩","💎",
    "📈","📊","💰","🏆","🧠","🎨"
]

def apply_tone(base_caption, tone):

    base_caption = base_caption.strip().capitalize().rstrip(".")

    emoji_count = 2 if tone in ["friendly", "casual", "promotional"] else 1
    selected_emojis = " ".join(random.sample(EMOJI_POOL, emoji_count))

    hashtags = get_relevant_hashtags(base_caption)

    if tone == "friendly":
        return f"So cool! {base_caption}! {selected_emojis}"

    elif tone == "casual":
        return f"Just vibing — {base_caption}! {selected_emojis}"

    elif tone == "promotional":
        return f"{base_caption}\nJoin the movement.\n{hashtags}"

    elif tone == "professional":
        return f"{base_caption}. A clear representation of the subject matter."

    elif tone == "informative":
        return f"This image illustrates {base_caption}, highlighting key elements."

    return base_caption
