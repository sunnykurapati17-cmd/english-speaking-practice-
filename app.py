from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

COMMON_WORDS = {
    "the","a","an","is","are","am","was","were","to","of","and","in","on",
    "for","with","this","that","it","i","you","he","she","we","they","my",
    "your","our","their","have","has","had","do","does","did","can","could",
    "will","would","should","be","been","being","as","at","from","or","but"
}

def analyze_text(text):
    text = text.strip()
    if not text:
        return {"error": "Please enter or speak a sentence."}

    words = re.findall(r"[A-Za-z']+", text.lower())
    sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]

    word_count = len(words)
    sentence_count = max(1, len(sentences))
    unique_words = len(set(words))

    filler_words = {"um", "uh", "like", "actually", "basically", "you know"}
    fillers = [w for w in words if w in filler_words]

    common = [w for w in words if w in COMMON_WORDS]
    vocabulary_score = min(100, round((unique_words / max(word_count, 1)) * 120))
    length_score = min(100, round((word_count / 20) * 100))

    grammar_tips = []
    if not text[0].isupper():
        grammar_tips.append("Start the sentence with a capital letter.")
    if not re.search(r"[.!?]$", text):
        grammar_tips.append("Try ending the sentence with punctuation.")
    if word_count < 5:
        grammar_tips.append("Try speaking in a longer sentence.")
    if fillers:
        grammar_tips.append("Reduce filler words such as: " + ", ".join(sorted(set(fillers))) + ".")

    # Simple rule-based grammar checks for beginner practice
    lower = text.lower()
    if re.search(r"\bi am go\b|\bi am go to\b", lower):
        grammar_tips.append("Use 'I am going...' instead of 'I am go...'.")
    if re.search(r"\bhe go\b|\bshe go\b", lower):
        grammar_tips.append("With he/she, use 'goes' instead of 'go'.")
    if re.search(r"\bi has\b|\bthey has\b", lower):
        grammar_tips.append("Use 'have' with I/you/we/they.")
    if re.search(r"\bhe have\b|\bshe have\b", lower):
        grammar_tips.append("Use 'has' with he/she/it.")

    grammar_score = max(40, 100 - len(grammar_tips) * 12)
    overall = round((vocabulary_score + length_score + grammar_score) / 3)

    if overall >= 85:
        level = "Excellent"
    elif overall >= 70:
        level = "Good"
    elif overall >= 50:
        level = "Needs Practice"
    else:
        level = "Beginner"

    return {
        "text": text,
        "word_count": word_count,
        "sentence_count": sentence_count,
        "unique_words": unique_words,
        "filler_count": len(fillers),
        "vocabulary_score": vocabulary_score,
        "grammar_score": grammar_score,
        "length_score": length_score,
        "overall_score": overall,
        "level": level,
        "tips": grammar_tips or ["Good job! Keep practicing regularly."],
        "common_words": sorted(set(common))
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}
    return jsonify(analyze_text(data.get("text", "")))

if __name__ == "__main__":
    app.run(debug=True)
