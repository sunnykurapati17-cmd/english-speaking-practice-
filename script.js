const textInput = document.getElementById("textInput");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const statusText = document.getElementById("status");

let recognition = null;

const prompts = [
    "Tell me about yourself.",
    "What did you do yesterday?",
    "Describe your favorite food.",
    "What are your career goals?",
    "Why are you learning English?",
    "Describe your college.",
    "Tell me about your best friend.",
    "What is your favorite hobby?"
];

function showPrompt() {
    const item = prompts[Math.floor(Math.random() * prompts.length)];
    document.getElementById("prompt").textContent = item;
}

showPrompt();

document.getElementById("newPrompt").addEventListener("click", showPrompt);

document.getElementById("speakPrompt").addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(document.getElementById("prompt").textContent);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        statusText.textContent = "🎙 Listening... Speak clearly in English.";
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalText += transcript + " ";
            } else {
                interimText += transcript;
            }
        }

        if (finalText) {
            textInput.value += finalText;
        }

        statusText.textContent = interimText
            ? "Listening: " + interimText
            : "🎙 Keep speaking...";
    };

    recognition.onerror = (event) => {
        statusText.textContent = "Speech recognition error: " + event.error;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    recognition.onend = () => {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusText.textContent = "Speech capture stopped.";
    };

    startBtn.addEventListener("click", () => {
        recognition.start();
    });

    stopBtn.addEventListener("click", () => {
        recognition.stop();
    });
} else {
    startBtn.disabled = true;
    statusText.textContent = "Speech recognition is not supported in this browser. Use Chrome or Edge.";
}

analyzeBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();

    if (!text) {
        alert("Please type or speak something first.");
        return;
    }

    statusText.textContent = "Analyzing your English...";

    const response = await fetch("/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text})
    });

    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("overallScore").textContent = data.overall_score;
    document.getElementById("level").textContent = data.level;
    document.getElementById("wordCount").textContent = data.word_count;
    document.getElementById("sentenceCount").textContent = data.sentence_count;
    document.getElementById("uniqueWords").textContent = data.unique_words;
    document.getElementById("fillerCount").textContent = data.filler_count;

    document.getElementById("grammarBar").style.width = data.grammar_score + "%";
    document.getElementById("vocabBar").style.width = data.vocabulary_score + "%";
    document.getElementById("lengthBar").style.width = data.length_score + "%";

    document.getElementById("resultText").textContent = data.text;

    const tips = document.getElementById("tips");
    tips.innerHTML = "";
    data.tips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tips.appendChild(li);
    });

    statusText.textContent = "Analysis completed.";
});

clearBtn.addEventListener("click", () => {
    textInput.value = "";
    document.getElementById("results").classList.add("hidden");
    statusText.textContent = "Ready to practice.";
});
