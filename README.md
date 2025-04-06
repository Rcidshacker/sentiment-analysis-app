# 🧠 Sentiment Analysis API with Flask

This repository contains a lightweight and efficient backend API for performing **sentiment analysis** on English text using Python’s **Flask** framework and **NLTK's VADER** sentiment model.

The API accepts raw text input and returns sentiment classification—**positive**, **neutral**, or **negative**—along with detailed scoring.

---

## ✨ Key Features

- 🔍 Real-time sentiment classification
- 🧠 Powered by VADER (Valence Aware Dictionary and sEntiment Reasoner)
- ⚙️ Lightweight and fast Flask backend
- 🔗 CORS-enabled for frontend integration
- 📦 Simple and production-ready

---

## 📂 Project Structure

```
sentiment-analysis-backend/
├── app.py               # Main Flask application
├── requirements.txt     # Dependency list
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rcidshacker/sentiment-analysis-backend.git
cd sentiment-analysis-backend
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
# Activate:
source venv/bin/activate         # Linux/macOS
venv\Scripts\activate            # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> The app auto-downloads the required `vader_lexicon`. You can manually run:
```bash
python -m nltk.downloader vader_lexicon
```

### 4. Start the Flask Server

```bash
python app.py
```

Your API will be live at: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Endpoints

### `GET /` – Health Check

Returns the current status of the backend.

**Response:**
```json
{
  "status": "Backend is running!"
}
```

---

### `POST /analyze` – Sentiment Classification

Analyzes the sentiment of a given text.

**Request Body:**
```json
{
  "text": "This project is absolutely fantastic!"
}
```

**Response:**
```json
{
  "sentiment": "positive",
  "score": 0.8625,
  "scores": {
    "neg": 0.0,
    "neu": 0.361,
    "pos": 0.639,
    "compound": 0.8625
  }
}
```

> The classification is determined using the `compound` score:
> - `compound >= 0.05`: Positive  
> - `compound <= -0.05`: Negative  
> - Otherwise: Neutral

---

## 🧪 Testing the API

You can test the API using:

### 🧰 Postman or Insomnia  
Send a `POST` request to `http://localhost:5000/analyze` with JSON payload.

### 🌀 cURL

```bash
curl -X POST http://localhost:5000/analyze \
-H "Content-Type: application/json" \
-d "{\"text\":\"I absolutely love this project!\"}"
```

---

## 👤 Author

**Ruchit Das**  
🔗 GitHub: [@Rcidshacker](https://github.com/Rcidshacker)  
🔗 LinkedIn: [Ruchit Das](https://www.linkedin.com/in/ruchit-das-3b6a8a252/)

---

## 📜 License

This project is released under the [MIT License](LICENSE). Feel free to use, modify, and distribute it with attribution.

---

## 🌐 Acknowledgements

- [NLTK](https://www.nltk.org/) – Natural Language Toolkit
- [Flask](https://flask.palletsprojects.com/) – Micro web framework for Python