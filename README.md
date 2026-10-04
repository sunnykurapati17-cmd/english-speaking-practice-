# English Speaking Practice Application

A beginner-friendly web application for practicing English speaking.

## Features

- 🎙 Speech-to-text using the browser Web Speech API
- ⌨️ Manual text input
- 📝 Practice sentences
- 🔊 Listen to practice sentences
- 📊 Word and sentence statistics
- 📚 Vocabulary analysis
- ✍️ Basic grammar suggestions
- 🚫 Filler-word detection
- ⭐ Overall English practice score
- 📱 Responsive interface

## Technologies

- Python
- Flask
- HTML
- CSS
- JavaScript
- Web Speech API

## How to Run

### 1. Open the project folder

Open `English_Speaking_Practice_Application` in VS Code.

### 2. Create a virtual environment (recommended)

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install packages

```bash
pip install -r requirements.txt
```

### 4. Start the application

```bash
python app.py
```

### 5. Open in browser

Go to:

```text
http://127.0.0.1:5000
```

Use Chrome or Edge for speech recognition.

## Project Structure

```text
English_Speaking_Practice_Application/
│
├── app.py
├── requirements.txt
├── README.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## How the Application Works

1. User selects a practice sentence.
2. User clicks **Start Speaking**.
3. Browser microphone captures English speech.
4. Speech is converted into text.
5. Flask sends the text to the analysis function.
6. The application calculates vocabulary, grammar, sentence length and filler-word scores.
7. Results and suggestions are displayed.

## Note

The grammar analysis in this student project is rule-based and intended for learning/demo purposes. It is not a replacement for a professional grammar checker.
