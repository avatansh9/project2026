import random

HASHTAG_CATEGORIES = {
    "crypto": {
        "keywords": ["bitcoin", "ethereum", "btc", "eth", "blockchain", "crypto", "altcoin", "defi", "nft"],
        "tags": [
            "#Crypto", "#Bitcoin", "#Ethereum", "#Blockchain", "#DeFi", "#Web3",
            "#Altcoins", "#CryptoTrading", "#CryptoNews", "#NFTs",
            "#CryptoInvestor", "#DigitalAssets", "#HODL", "#BullRun", "#BearMarket"
        ]
    },

    "finance": {
        "keywords": ["stock", "market", "trading", "investing", "chart", "equity", "portfolio"],
        "tags": [
            "#Finance", "#StockMarket", "#Trading", "#Investing", "#Wealth",
            "#FinancialFreedom", "#MoneyManagement", "#Portfolio", "#DayTrading",
            "#SwingTrading", "#TechnicalAnalysis", "#FundamentalAnalysis",
            "#WealthBuilding", "#PassiveIncome"
        ]
    },

    "tech": {
        "keywords": ["ai", "coding", "programming", "software", "developer", "startup", "machine learning"],
        "tags": [
            "#Tech", "#AI", "#Coding", "#Programming", "#Startup",
            "#DeveloperLife", "#SoftwareEngineering", "#MachineLearning",
            "#DataScience", "#WebDevelopment", "#Innovation",
            "#Automation", "#FutureTech"
        ]
    },

    "fitness": {
        "keywords": ["gym", "workout", "training", "muscle", "fitness", "cardio"],
        "tags": [
            "#Fitness", "#GymLife", "#Workout", "#Training",
            "#FitLife", "#HealthyLifestyle", "#MuscleBuilding",
            "#Cardio", "#StrengthTraining", "#BodyTransformation",
            "#Discipline", "#Consistency"
        ]
    },

    "motivation": {
        "keywords": ["success", "discipline", "focus", "hustle", "mindset"],
        "tags": [
            "#Motivation", "#SuccessMindset", "#Discipline",
            "#Hustle", "#StayFocused", "#GrowthMindset",
            "#SelfImprovement", "#NoExcuses", "#DreamBig",
            "#EntrepreneurLife"
        ]
    },

    "education": {
        "keywords": ["study", "exam", "learning", "student", "college"],
        "tags": [
            "#StudyMode", "#StudentLife", "#Learning",
            "#Education", "#ExamPreparation", "#FocusTime",
            "#Knowledge", "#CareerGoals", "#StudyHard"
        ]
    },

    "lifestyle": {
        "keywords": ["life", "morning", "routine", "daily", "habits"],
        "tags": [
            "#Lifestyle", "#DailyRoutine", "#MorningRoutine",
            "#Habits", "#Productivity", "#LifeGoals",
            "#Balance", "#SelfGrowth"
        ]
    }

}

def get_relevant_hashtags(caption):
    caption_lower = caption.lower()
    matched_tags = []

    for category in HASHTAG_CATEGORIES.values():
        for keyword in category["keywords"]:
            if keyword in caption_lower:
                matched_tags.extend(category["tags"])
                break

    matched_tags = list(set(matched_tags))

    if matched_tags:
        return " ".join(random.sample(matched_tags, min(5, len(matched_tags))))

    return "#Trending #ViralPost"
